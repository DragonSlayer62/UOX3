/// <reference path="../../definitions.d.ts" />
// @ts-check

// temp globals for the AreaItemFunction scan
var redeedScratchParts = null;
var redeedMasterSer    = 0;

/** @type { ( user: Character, iUsing: Item ) => boolean } */
function onUseChecked(pUser, iUsed)
{
	var pSock = pUser.socket;
	if (pSock == null)
		return false;

	pSock.tempObj = iUsed;
	ReDeedAddonGump(pUser);
	return true;
}

function ReDeedAddonGump(pUser)
{
	var socket = pUser.socket;
	if (socket== null)
		return;

	var redeedGump = new Gump;

	redeedGump.AddPage(0);
	redeedGump.AddBackground(0, 0, 220, 170, 0x13BE);
	redeedGump.AddBackground(10, 10, 200, 150, 0x0BB8);

	redeedGump.AddHTMLGump(20, 30, 180, 60, false, false, "<basefont color=#ffffff>" + GetDictionaryEntry(5506, socket.language) + "</basefont>");

	// CONTINUE = 1
	redeedGump.AddHTMLGump(55, 100, 160, 25, false, false, "<basefont color=#ffffff>CONTINUE</basefont>");
	redeedGump.AddButton(20, 100, 0x0FA5, 0x0FA7, 1, 0, 1);

	// CANCEL = 0
	redeedGump.AddHTMLGump(55, 125, 160, 25, false, false, "<basefont color=#ffffff>CANCEL</basefont>");
	redeedGump.AddButton(20, 125, 0x0FA5, 0x0FA7, 0, 0, 0);

	redeedGump.Send(socket);
	redeedGump.Free();
}

/** @type { ( myObj: Socket, pressed: number, gump: GumpData ) => void } */
function onGumpPress(pSock, pButton, gumpData)
{
	var pUser = pSock.currentChar;
	if (!ValidateObject(pUser))
		return;

	if (pButton != 1)
		return; // cancel/close

	var clicked = pSock.tempObj;
	if (!ValidateObject(clicked))
		return;

	// Must be in a house multi at the addon location
	var iMulti = FindMulti(clicked.x, clicked.y, clicked.z, pUser.worldnumber);
	if (!ValidateObject(iMulti) || iMulti.IsBoat() || !iMulti.IsInMulti(pUser))
	{
		pSock.SysMessage(GetDictionaryEntry(2067, pSock.language)); // must be in house
		return;
	}

	// Owner/co-owner check
	if (!(iMulti.IsOnOwnerList(pUser)
		|| (GetServerSetting("COOWNHOUSESONSAMEACCOUNT") && ValidateObject(iMulti.owner) && iMulti.owner.accountNum == pUser.accountNum)))
	{
		pSock.SysMessage(GetDictionaryEntry(2067, pSock.language));
		return;
	}

	// Determine master serial
	var masterSer = clicked.GetTag("addonMaster");
	if (!masterSer || masterSer <= 0)
		masterSer = clicked.serial;

	// Determine deed type + DFN section
	var deedType = clicked.GetTag("addonDeedType") | 0;
	var deedName = ResolveDeedNameFromType(deedType);

	if (deedName == "")
	{
		pSock.SysMessage(GetDictionaryEntry(5507, pSock.language)); // Error Report to GM
		return;
	}

	// Gather all parts safely (PASS SOCKET, not a number!)
	var parts = CollectAddonPartsByMaster(clicked, masterSer, pSock);

	// Fallback: at least handle clicked part
	if (!parts || parts.length <= 0)
		parts = [clicked];

	for (var c = 0; c < parts.length; c++)
	{
		var itC = parts[c];
		if (!ValidateObject(itC))
			continue;

		if (itC.GetTag("addonIsContainer") == 1)
		{
			if ((itC.totalItemCount | 0) > 0)
			{
				pSock.SysMessage("That container must be emptied before it can be redeeded.");
				return;
			}
		}
	}

	// Release all parts (release first, delete after)
	for (var i = 0; i < parts.length; i++)
	{
		var it = parts[i];
		if (ValidateObject(it))
			iMulti.ReleaseItem(it);
	}

	var lockdownsLeft = iMulti.maxLockdowns - iMulti.lockdowns;
	pSock.SysMessage(GetDictionaryEntry(1902, pSock.language), lockdownsLeft);

	// Create deed back
	var deeditem = CreateDFNItem(pSock, pUser, deedName, 1, "ITEM", true);
	if (!ValidateObject(deeditem))
		return;

	// Delete all parts
	for (var d = 0; d < parts.length; d++)
	{
		if (ValidateObject(parts[d]))
			parts[d].Delete();
	}
}

function IsAddonContainerNotEmpty(itm)
{
	if (!ValidateObject(itm))
		return false;

	// totalItemCount is read-only and includes sub-containers
	var cnt = itm.totalItemCount | 0;
	return (cnt > 0);
}

function ResolveDeedNameFromType(deedType)
{
	switch (deedType)
	{
		case 1: return "WreathDeed";
		case 2: return "firepaintingdeed";
		case 3: return "embroideredtapestrydeed";
		case 4: return "15thanniversarylithographdeed";
		case 5: return "alchemistsbookshelfdeed";
		case 6: return "bulltapestrydeed";
		case 7: return "fourpostbeeddeed";
		default: return "";
	}
}

// ----------------------
// Collect parts by master
// ----------------------
//
// IMPORTANT FIXES:
// - Pass pSock as 4th arg to AreaItemFunction (native expects Socket* / BaseObject)
// - Use clicked item as origin (safe BaseObject)
// - Use global redeedMasterSer for filtering (no socket tags needed)
//
function CollectAddonPartsByMaster(originObj, masterSer, pSock)
{
	redeedScratchParts = [];
	redeedMasterSer = masterSer;

	// radius: bump if your addons can span >30 tiles
	AreaItemFunction("Redeed_FindAddonParts", originObj, 30, pSock);

	var out = redeedScratchParts;
	redeedScratchParts = null;
	redeedMasterSer = 0;

	return out;
}

// Called per item in AreaItemFunction scan.
// Signature MUST match: (originObj, itemToCheck, socket)
function Redeed_FindAddonParts(originObj, itemToCheck, pSock)
{
	if (!ValidateObject(itemToCheck))
		return false;

	var ms = itemToCheck.GetTag("addonMaster");
	if (!ms || ms <= 0)
		return false;

	if (ms != redeedMasterSer)
		return false;

	redeedScratchParts.push(itemToCheck);
	return false; // keep scanning
}