/// <reference path="../../definitions.d.ts" />
// @ts-check

var TF_WALL     = 4;
var TF_BLOCKING = 6;
var TF_ROOF     = 28;

/** @type { (  user: Character, iUsing: Item  ) => boolean } */
function onUseChecked( pUser, iUsed )
{
	var pSocket = pUser.socket;
	if( pSocket == null )
		return false;

	pSocket.tempObj = iUsed;          // temp
	pUser._addonPlaceOrient = 0;      // temp

	var iMulti = pUser.multi;
	var itemOwner = GetPackOwner( iUsed, 0 );

	if( itemOwner == null || itemOwner.serial != pUser.serial )
	{
		pSocket.SysMessage( GetDictionaryEntry( 1763, pSocket.language )); // must be in backpack
		return false;
	}

	if( ValidateObject( iMulti ) && ( iMulti.IsOnOwnerList( pUser )
		|| ( GetServerSetting( "COOWNHOUSESONSAMEACCOUNT" ) && ValidateObject( iMulti.owner ) && iMulti.owner.accountNum == pUser.accountNum )))
	{
		AddonGump( pUser, iUsed );
		return true;
	}
	else
	{
		pSocket.SysMessage( GetDictionaryEntry( 2067, pSocket.language )); // must be in house
		return false;
	}
}

function AddonGump(  pUser, iUsed  )
{
	var pSocket = pUser.socket;
	if(  pSocket == null  )
		return;

	var definition = AddonDisplayDefinition( iUsed );
	if(  !definition  )
	{
		pSocket.SysMessage( "This deed has no addon definition." );
		return;
	}

	var addonDeedGump = new Gump;
	addonDeedGump.AddPage( 0 );
	addonDeedGump.AddBackground( 0, 0, 300, 150, 0xA28 );

	addonDeedGump.AddXMFHTMLTok( 30, 30, 240, 20, false, false, 0x0, 1113302, "#" + 1080392 );

	AddPreview( addonDeedGump, 90, 60, definition.previewWest );
	AddPreview( addonDeedGump, 180, 60, definition.previewNorth );
	 
	// If it has orientations (west/north), show both buttons.
	// Otherwise show ONE "Place" button (id=1) and center it.
	if( definition.hasOrientation === false )
	{
		// One place button
		addonDeedGump.AddButton( 145, 65, 0x868, 0x869, 1, 0, 1 );
	}
	else
	{
		// 1 = west, 2 = north
		addonDeedGump.AddButton( 50, 65, 0x868, 0x869, 1, 0, 1 );
		addonDeedGump.AddButton( 145, 65, 0x868, 0x869, 1, 0, 2 );
	}

	addonDeedGump.Send( pSocket );
	addonDeedGump.Free(  );
}

function AddPreview( addonDeedGump, x, y, preview )
{
	// If it's a number, treat as gump art ID
	if( typeof preview === "number" )
	{
		addonDeedGump.AddPicture( x, y, preview );
		return;
	}

	// If it's a string, draw a label box
	var text = ( preview == null ) ? "" : ( "" + preview );

	// Simple framed label ( adjust sizes as you like )
	addonDeedGump.AddBackground( x - 6, y - 2, 60, 40, 0x0BB8 ); // small panel

	addonDeedGump.AddHTMLGump( x, y, 52, 36, false, false, "<basefont color=#ffffff><center>" + text + "</center></basefont>" );
}

/** @type { (  myObj: Socket, pressed: number, gump: GumpData  ) => void } */
function onGumpPress( socket, pButton, gumpData )
{
	var pUser = socket.currentChar;
	if( !ValidateObject( pUser ))
		return;

	var iMulti = pUser.multi;
	if( !ValidateObject( iMulti ) || iMulti.IsBoat() || !iMulti.IsInMulti( pUser ))
	{
		socket.SysMessage( GetDictionaryEntry( 2067, socket.language )); // must be in house
		return;
	}

	switch ( pButton )
	{
		case 0:
			break;

		case 1:
		case 2:
			pUser._addonPlaceOrient = pButton; // TEMP ( not saved )
			socket.CustomTarget( 0, GetDictionaryEntry( 5500, socket.language )); // Where would you like to place this decoration?
			break;
	}
}

/** @type { (  tSock: Socket, target: Character | Item | null  ) => void } */
function onCallback0( socket, myTarget )
{
	var pUser = socket.currentChar;
	if( !ValidateObject( pUser ))
		return;

	var iUsed = socket.tempObj;
	if( !ValidateObject( iUsed ))
		return;

	// Read+clear TEMP choice immediately
	var orient = pUser._addonPlaceOrient || 0;
	pUser._addonPlaceOrient = 0;

	if( orient != 1 && orient != 2 )
		return;

	// Must still be in backpack
	var itemOwner = GetPackOwner( iUsed, 0 );
	if( itemOwner == null || itemOwner.serial != pUser.serial )
	{
		socket.SysMessage( GetDictionaryEntry( 1763, socket.language ));
		return;
	}

	var targX = socket.GetWord( 11 );
	var targY = socket.GetWord( 13 );
	var targZ = socket.GetSByte( 16 );

	// NEW: do not allow placing directly on static wall tiles
	if (IsBadStaticPlacementSpot(targX, targY, targZ, pUser.worldnumber))
	{
		socket.SysMessage("You cannot place that on a wall.");
		return;
	}

	var iMulti = FindMulti( targX, targY, targZ, pUser.worldnumber );
	if( !ValidateObject( iMulti ) || iMulti.IsBoat(  ) || !iMulti.IsInMulti( pUser ) )
	{
		socket.SysMessage( GetDictionaryEntry( 5502, socket.language ) ); // not in your house
		return;
	}

	// Door adjacency check ( same as your logic )
	if( ValidateObject( myTarget ) )
	{
		var foundDoor = AreaItemFunction( "CheckForNearbyDoors", myTarget, 2, socket );
		if( foundDoor )
		{
			socket.SysMessage( GetDictionaryEntry( 1890, socket.language ));
			return;
		}
	}

	var definition = AddonDisplayDefinition( iUsed );
	if( !definition )
	{
		socket.SysMessage( "This deed has no addon definition." );
		return;
	}

	// Defaults
	var requireWall = ( definition.requireWall == null ) ? true : !!definition.requireWall;
	var hasOrient   = ( definition.hasOrientation == null ) ? true : !!definition.hasOrientation;

	if( requireWall )
	{
		var w = pUser.worldnumber;
		var inst = pUser.instanceID;
		var z = targZ;

		var NorthWall = CheckDynamicFlag( targX, targY - 1, z, w, inst, 4 ) || CheckDynamicFlag( targX, targY + 1, z, w, inst, 4 );
		var WestWall = CheckDynamicFlag( targX - 1, targY, z, w, inst, 4 ) || CheckDynamicFlag( targX + 1, targY, z, w, inst, 4 );

		// If oriented, enforce correct wall side
		if( hasOrient )
		{
			if( orient == 2 && !NorthWall )
			{
				socket.SysMessage( GetDictionaryEntry( 5501, socket.language ));
				return;
			}
			if( orient == 1 && !WestWall )
			{
				socket.SysMessage( GetDictionaryEntry( 5501, socket.language ));
				return;
			}
		}
		else
		{
			// Non-oriented wall-hung: accept either wall
			if( !NorthWall && !WestWall )
			{
				socket.SysMessage( GetDictionaryEntry( 5501, socket.language ));
				return;
			}
		}
	}

	var parts = null;

	if( !hasOrient )
	{
		// Non-oriented addons use definition.parts
		parts = definition.parts;
	}
	else
	{
		// Oriented addons use west/north
		if( orient != 1 && orient != 2 )
			return;

		parts = ( orient == 2 ) ? definition.north : definition.west;
	}

	if( !parts || parts.length <= 0 )
	{
		socket.SysMessage( "Addon definition has no components." );
		return;
	}

	// Lockdown capacity check for ALL parts
	if( ( iMulti.lockdowns + parts.length ) > iMulti.maxLockdowns )
	{
		socket.SysMessage( GetDictionaryEntry( 1895, socket.language ));
		return;
	}

	// Stamp deed type once
	var deedType = iUsed.GetTag( "addondeed" );
	if( deedType <= 0 )
	{
		socket.SysMessage( "This deed is missing addondeed tag." );
		return;
	}

	// Place all parts; rollback on failure
	var created = [];
	for ( var i = 0; i < parts.length; i++ )
	{
		var p = parts[i];
		if( !p ) continue;

		var id  = p.id | 0;
		var dx  = p.dx | 0;
		var dy  = p.dy | 0;
		var dz  = p.dz | 0;
		var hue = ( p.hue == null ) ? 0x0 : ( p.hue | 0 );

		var itm = CreateBlankItem( null, null, 1, definition.name, id, hue, "ITEM", false );
		if( !ValidateObject( itm ))
		{
			DeleteCreated( created );
			return;
		}

		var px = targX + dx;
		var py = targY + dy;
		var pz = targZ + dz;

		if (IsBadStaticPlacementSpot(px, py, pz, pUser.worldnumber))
		{
			socket.SysMessage("You cannot place that there.");
			DeleteCreated(created);
			return;
		}

		if (IsBadAddonComponentTile(id, definition))
		{
			socket.SysMessage("That addon component uses a wall/blocked tile ID. Fix the definition.");
			DeleteCreated(created);
			return;
		}

		itm.Teleport( targX + dx, targY + dy, targZ + dz );

		// Optional: keep sectionID for DFN/debug readability
		itm.sectionID = "0x" + ( id >>> 0 ).toString( 16 ).toUpperCase();

		// Link parts together + store deedType ( PERSISTENT ON ITEMS, which is fine )
		if( created.length == 0 )
		{
			itm.SetTag( "addonMaster", itm.serial );
		}
		else
		{
			itm.SetTag( "addonMaster", created[0].serial );
		}
		itm.SetTag( "addonPart", i );
		itm.SetTag( "addonDeedType", deedType );

		itm.AddScriptTrigger( 5609 );
		if( definition.container && i == 0 )
		{
			ApplyContainerProps( itm, definition.container );
			itm.SetTag( "addonIsContainer", 1 );
		}

		iMulti.LockDownItem( itm );

		created.push( itm );
	}

	iUsed.Delete(  );
}

function IsBadStaticPlacementSpot(x, y, z, world)
{
	// Don’t place *on* static walls (and optionally other blockers)
	if (CheckStaticFlag(x, y, z, world, 4))  // TF_WALL
		return true;

	// Optional hardening (uncomment if you want stricter blocking)
	// if (CheckStaticFlag(x, y, z, world, 6))  // TF_BLOCKING
	// 	return true;

	// if (CheckStaticFlag(x, y, z, world, 28)) // TF_ROOF
	// 	return true;

	return false;
}

function IsBadAddonComponentTile(tileID, definition)
{
	// If definition explicitly allows wall tiles, skip.
	// (Use this for true wall-hung art that has TF_WALL)
	if (definition && definition.allowWallTiles)
		return false;

	// Block wall tiles as addon components by default
	if (CheckTileFlag(tileID, TF_WALL))
		return true;

	// Optional: also block impassables
	// if (CheckTileFlag(tileID, TF_BLOCKING))
	// 	return true;

	return false;
}

function ApplyContainerProps(itm, c)
{
	if (!ValidateObject(itm) || !c)
		return;

	// type
	if (c.type != null)
		itm.type = (c.type | 0);

	// maxItems
	if (c.maxItems != null)
		itm.maxItems = (c.maxItems | 0);

	// weightMax
	if (c.weightMax != null)
		itm.weightMax = (c.weightMax | 0);
}

function AddonDisplayDefinition( iUsed )
{
	switch ( iUsed.GetTag( "addondeed" ) )
	{
		case 1:
			return {
				name: "a wreath",
				previewWest:  0x232D,
				previewNorth: 0x232C,
				requireWall: true,
				hasOrientation: true,
				allowWallTiles: true,
				west:  [ { id: 0x232D, dx: 0, dy: 0, dz: 0, hue: 0x0 } ],
				north: [ { id: 0x232C, dx: 0, dy: 0, dz: 0, hue: 0x0 } ]
			};

		case 2:
			return {
				name: "a painting",
				previewWest:  0x4C29,
				previewNorth: 0x4C28,
				requireWall: true,
				hasOrientation: true,
				allowWallTiles: true,

				// EXAMPLE multi-piece ( swap ids/offsets to match your real addon )
				west: [
					{ id: 0x4C29, dx: 0, dy: 0, dz: 0, hue: 0x0 }
				],
				north: [
					{ id: 0x4C28, dx: 0, dy: 0, dz: 0, hue: 0x0 }
				]
			};

		case 3:
			return {
				name: "embroidered tapestry",
				previewWest:  "Tapestry<br>( South )",
				previewNorth: "Tapestry<br>( East )",
				requireWall: true,
				hasOrientation: true,
				allowWallTiles: true,
				// EXAMPLE multi-piece ( swap ids/offsets to match your real addon )
				west: [
					{ id: 0x4C9B, dx: 0, dy: 1, dz: 0, hue: 0x0 },
					{ id: 0x4C9A, dx: 0, dy: 0, dz: 0, hue: 0x0 }
				],
				north: [
					{ id: 0x4C98, dx: 0, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C99, dx: 1, dy: 0, dz: 0, hue: 0x0 }
				]
			};

		case 4:
			return {
				name: "15th Anniversary Lithograph",
				previewWest:  "South",
				previewNorth: "East",
				requireWall: true,
				hasOrientation: true,
				allowWallTiles: true,

				// EXAMPLE multi-piece ( swap ids/offsets to match your real addon )
				west: [
					{ id: 0x4C34, dx: 0, dy: 1, dz: 0, hue: 0x0 },
					{ id: 0x4C33, dx: 0, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C32, dx: 0, dy: -1, dz: 0, hue: 0x0 }
				],
				north: [
					{ id: 0x4C35, dx: 1, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C36, dx: 0, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C37, dx: -1, dy: 0, dz: 0, hue: 0x0 }
				]
			};

		case 5:
			return {
				name: "Alchemist Bookcase",
				previewWest:  0x4C25,
				previewNorth: 0x4C24,
				requireWall: false,
				hasOrientation: true,
				allowWallTiles: true,

				// NEW: container settings (optional)
				container: {
					type: 1,
					maxItems: 125,
					weightMax: 40000 // 400.00 stones (since 100 = 1.00 stone)
				},

				// EXAMPLE multi-piece ( swap ids/offsets to match your real addon )
				west: [
					{ id: 0x4C25, dx: 0, dy: 0, dz: 0, hue: 0x0 }
				],
				north: [
					{ id: 0x4C24, dx: 0, dy: 0, dz: 0, hue: 0x0 }
				]
			};

		case 6:
			return {
				name: "bull tapestry",
				previewWest:  "Tapestry<br>( South )",
				previewNorth: "Tapestry<br>( East )",
				requireWall: true,
				hasOrientation: true,
				allowWallTiles: true,

				// EXAMPLE multi-piece ( swap ids/offsets to match your real addon )
				west: [
					{ id: 0x4CA3, dx: 0, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4CA2, dx: 0, dy: 1, dz: 0, hue: 0x0 }
				],
				north: [
					{ id: 0x4CA1, dx: 1, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4CA0, dx: 0, dy: 0, dz: 0, hue: 0x0 }
				]
			};

		case 7:
			return {
				name: "four post bed",
				previewWest:  "South",
				previewNorth: "East",
				requireWall: false,
				hasOrientation: true,
				allowWallTiles: true,

				// EXAMPLE multi-piece ( swap ids/offsets to match your real addon )
				west: [
					{ id: 0x4C71, dx: 1, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C70, dx: 1, dy: 1, dz: 0, hue: 0x0 },
					{ id: 0x4C6E, dx: 0, dy: 1, dz: 0, hue: 0x0 },
					{ id: 0x4C72, dx: 0, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C73, dx: -1, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C6F, dx: -1, dy: 1, dz: 0, hue: 0x0 }
				],
				north: [
					{ id: 0x4C69, dx: 1, dy: 1, dz: 0, hue: 0x0 },
					{ id: 0x4C68, dx: 1, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C6D, dx: 0, dy: 1, dz: 0, hue: 0x0 },
					{ id: 0x4C6C, dx: 0, dy: 0, dz: 0, hue: 0x0 },
					{ id: 0x4C6A, dx: 1, dy: -1, dz: 0, hue: 0x0 },
					{ id: 0x4C6B, dx: 0, dy: -1, dz: 0, hue: 0x0 }
				]
			};

		default:
			return null;
	}
}

function DeleteCreated( list )
{
	for ( var i = 0; i < list.length; i++ )
	{
		if( ValidateObject( list[i] ))
			list[i].Delete();
	}
}

// Your existing helper ( unchanged )
function CheckForNearbyDoors( myTarget, itemToCheck, pSocket )
{
	if( ValidateObject( itemToCheck ))
	{
		if( ( itemToCheck.type == 12 || itemToCheck.type == 13 ))
		{
			if( itemToCheck.z > myTarget.z && itemToCheck.z - myTarget.z >= 20 )
				return false;
			else if( itemToCheck.z < myTarget.z && myTarget.z - itemToCheck.z >= 20 )
				return false;

			if( itemToCheck.isDoorOpen )
			{
				var origX = itemToCheck.x - itemToCheck.GetTag( "DOOR_X" );
				var origY = itemToCheck.y - itemToCheck.GetTag( "DOOR_Y" );
				if( myTarget.x - origX < 2 || origX - myTarget.x < 2 || myTarget.y - origY < 2 || origY - myTarget.y < 2 )
					return true;
			}

			if( myTarget.DistanceTo( itemToCheck ) <= 2 )
				return true;
		}
	}
	return false;
}