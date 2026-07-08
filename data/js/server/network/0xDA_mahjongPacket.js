/// <reference path="../../definitions.d.ts" />
// @ts-check
// Mahjong 0xDA packet helper for UOX3.
// SpiderMonkey 1.8.5 / ES5 safe.

var mahjongBoardScriptID = 5071;
var mahjongMaxPlayers = 4;
var mahjongPacketDebug = true;

var MAHJONG_DIR_UP = 0;
var MAHJONG_DIR_LEFT = 1;
var MAHJONG_DIR_DOWN = 2;
var MAHJONG_DIR_RIGHT = 3;

function PacketRegistration()
{
	RegisterPacket( 0xDA, 0x00 );
}

function MahjongPacketLog( pSocket, message )
{
	if( !mahjongPacketDebug )
		return;

	Console.Print( "[Mahjong 0xDA] " + message + "\n" );
	if( pSocket != null )
		pSocket.SysMessage( "[Mahjong 0xDA] " + message );
}

/** @type { ( mSock: Socket, packetNum: number ) => boolean } */
function onPacketReceive( pSocket, packetNum )
{
	var cmd = pSocket.GetByte( 0 );
	if( cmd != packetNum )
		return;

	pSocket.ReadBytes( 3 );
	var packetLength = pSocket.GetWord( 1 );
	if( packetLength < 9 )
		return;

	pSocket.ReadBytes( packetLength );

	var boardSerial = pSocket.GetDWord( 3 );
	var board = CalcItemFromSer( boardSerial );
	if( !ValidateObject( board ))
	{
		MahjongPacketLog( pSocket, "Incoming packet has invalid board serial. serial=" + boardSerial );
		return;
	}

	var subCommand = pSocket.GetByte( 8 );
	MahjongPacketLog( pSocket, "Incoming packet length=" + packetLength + " sub=0x" + MahjongByteToHex( subCommand ) + " board=" + board.serial );
	TriggerEvent( mahjongBoardScriptID, "MahjongHandlePacket", pSocket, board, subCommand );
	return;
}

function MahjongSendJoinPacket( pSocket, board )
{
	MahjongPacketLog( pSocket, "Sending join packet. board=" + board.serial + " length=9 sub=0x19" );

	var packet = MahjongBasePacket( 9, board, 0x19 );
	pSocket.Send( packet );
	packet.Free();
}

function MahjongSendRelievePacket( pSocket, board )
{
	MahjongPacketLog( pSocket, "Sending relieve packet. board=" + board.serial + " length=9 sub=0x1A" );

	var packet = MahjongBasePacket( 9, board, 0x1A );
	pSocket.Send( packet );
	packet.Free();
}

function MahjongSendPlayersPacketToAll( board )
{
	MahjongSendToAll( board, "players", null );
}

function MahjongSendGeneralPacketToAll( board )
{
	MahjongSendToAll( board, "general", null );
}

function MahjongSendTilesPacketToAll( board )
{
	MahjongSendToAll( board, "tiles", null );
}

function MahjongSendTilePacketToAll( board, tile )
{
	MahjongSendToAll( board, "tile", tile );
}

function MahjongSendToAll( board, packetType, tile )
{
	for( var index = 0; index < mahjongMaxPlayers; index++ )
	{
		var playerSerial = board.GetTag( "mahjongSeat" + index );
		if( playerSerial != 0 && board.GetTag( "mahjongInGame" + index ) == 1 )
		{
			var player = CalcCharFromSer( playerSerial );
			if( ValidateObject( player ) && player.socket != null )
			{
				if( packetType == "players" )
					MahjongSendPlayersPacket( player.socket, board );
				else if( packetType == "general" )
					MahjongSendGeneralPacket( player.socket, board );
				else if( packetType == "tiles" )
					MahjongSendTilesPacket( player.socket, board );
				else if( packetType == "tile" )
					MahjongSendTilePacket( player.socket, board, tile );
			}
		}
	}
}

function MahjongSendPlayersPacket( pSocket, board )
{
	var pUser = pSocket.currentChar;
	var entries = [];
	var showScores = board.GetTag( "mahjongShowScores" ) == 1;

	for( var index = 0; index < mahjongMaxPlayers; index++ )
	{
		var playerSerial = board.GetTag( "mahjongSeat" + index );
		var player = null;
		if( playerSerial != 0 )
			player = CalcCharFromSer( playerSerial );

		if( ValidateObject( player ))
		{
			entries[entries.length] = { index:index, player:player, empty:false };
		}
		else if( showScores )
		{
			entries[entries.length] = { index:index, player:null, empty:true };
		}
	}

	var packetLength = 11 + ( entries.length * 45 );
	MahjongPacketLog( pSocket, "Sending players packet. entries=" + entries.length + " length=" + packetLength + " sub=0x02" );

	var packet = MahjongBasePacket( packetLength, board, 0x02 );
	packet.WriteByte( 9, 0 );
	packet.WriteByte( 10, entries.length );

	var offset = 11;
	for( var entryIndex = 0; entryIndex < entries.length; entryIndex++ )
	{
		var entry = entries[entryIndex];
		if( entry.empty )
		{
			packet.WriteLong( offset, 0 ); offset += 4;
			packet.WriteByte( offset, 0x02 ); offset++;
			packet.WriteByte( offset, entry.index ); offset++;
			packet.WriteLong( offset, board.GetTag( "mahjongScore" + entry.index ) ); offset += 4;
			packet.WriteShort( offset, 0 ); offset += 2;
			packet.WriteByte( offset, 0 ); offset++;
			packet.WriteByte( offset, board.GetTag( "mahjongPublic" + entry.index ) == 1 ? 1 : 0 ); offset++;
			MahjongWriteAsciiFixed( packet, offset, "", 30 ); offset += 30;
			packet.WriteByte( offset, 1 ); offset++;
		}
		else
		{
			packet.WriteLong( offset, entry.player.serial ); offset += 4;
			packet.WriteByte( offset, board.GetTag( "mahjongDealer" ) == entry.index ? 0x01 : 0x02 ); offset++;
			packet.WriteByte( offset, entry.index ); offset++;

			if( showScores || pUser == entry.player )
				packet.WriteLong( offset, board.GetTag( "mahjongScore" + entry.index ) );
			else
				packet.WriteLong( offset, 0 );
			offset += 4;

			packet.WriteShort( offset, 0 ); offset += 2;
			packet.WriteByte( offset, 0 ); offset++;
			packet.WriteByte( offset, board.GetTag( "mahjongPublic" + entry.index ) == 1 ? 1 : 0 ); offset++;
			MahjongWriteAsciiFixed( packet, offset, entry.player.name, 30 ); offset += 30;
			packet.WriteByte( offset, board.GetTag( "mahjongInGame" + entry.index ) == 1 ? 0 : 1 ); offset++;
		}
	}

	pSocket.Send( packet );
	packet.Free();
}

function MahjongSendGeneralPacket( pSocket, board )
{
	MahjongPacketLog( pSocket, "Sending general packet. length=25 sub=0x05" );

	var packet = MahjongBasePacket( 25, board, 0x05 );
	packet.WriteShort( 9, 0 );
	packet.WriteByte( 11, 0 );
	packet.WriteByte( 12, ( board.GetTag( "mahjongShowScores" ) == 1 ? 0x01 : 0x00 ) | ( board.GetTag( "mahjongSpectatorVision" ) == 1 ? 0x02 : 0x00 ) );
	packet.WriteByte( 13, board.GetTag( "mahjongDiceOne" ) );
	packet.WriteByte( 14, board.GetTag( "mahjongDiceTwo" ) );
	packet.WriteByte( 15, board.GetTag( "mahjongDealerWind" ) );
	packet.WriteShort( 16, board.GetTag( "mahjongDealerY" ) );
	packet.WriteShort( 18, board.GetTag( "mahjongDealerX" ) );
	packet.WriteByte( 20, board.GetTag( "mahjongDealerDir" ) );
	packet.WriteShort( 21, board.GetTag( "mahjongBreakY" ) );
	packet.WriteShort( 23, board.GetTag( "mahjongBreakX" ) );
	pSocket.Send( packet );
	packet.Free();
}

function MahjongSendTilesPacket( pSocket, board )
{
	var tiles = MahjongGetTiles( board );
	var packetLength = 11 + ( tiles.length * 9 );
	MahjongPacketLog( pSocket, "Sending tiles packet. tiles=" + tiles.length + " length=" + packetLength + " sub=0x04" );

	var packet = MahjongBasePacket( packetLength, board, 0x04 );
	packet.WriteShort( 9, tiles.length );

	var offset = 11;
	for( var index = 0; index < tiles.length; index++ )
		offset = MahjongWriteTile( packet, offset, pSocket.currentChar, board, tiles[index] );

	pSocket.Send( packet );
	packet.Free();
}

function MahjongSendTilePacket( pSocket, board, tile )
{
	MahjongPacketLog( pSocket, "Sending tile packet. length=18 sub=0x03 tile=" + tile.number );

	var packet = MahjongBasePacket( 18, board, 0x03 );
	MahjongWriteTile( packet, 9, pSocket.currentChar, board, tile );
	pSocket.Send( packet );
	packet.Free();
}

function MahjongBasePacket( packetLength, board, subCommand )
{
	var packet = new Packet;
	packet.ReserveSize( packetLength );
	packet.WriteByte( 0, 0xDA );
	packet.WriteShort( 1, packetLength );
	packet.WriteLong( 3, board.serial );
	packet.WriteByte( 7, 0 );
	packet.WriteByte( 8, subCommand );
	return packet;
}

function MahjongGetTiles( board )
{
	var rawTiles = String( board.GetTag( "mahjongTiles" )).split( "|" );
	var tiles = [];
	for( var index = 0; index < rawTiles.length; index++ )
	{
		var parts = rawTiles[index].split( "," );
		if( parts.length >= 7 )
		{
			tiles[tiles.length] = {
				number:Number( parts[0] ),
				value:Number( parts[1] ),
				x:Number( parts[2] ),
				y:Number( parts[3] ),
				stackLevel:Number( parts[4] ),
				direction:Number( parts[5] ),
				flipped:Number( parts[6] )
			};
		}
	}
	return tiles;
}

function MahjongWriteTile( packet, offset, viewer, board, tile )
{
	packet.WriteByte( offset, tile.number ); offset++;
	packet.WriteByte( offset, MahjongTileVisibleValue( viewer, board, tile ) ); offset++;
	packet.WriteShort( offset, tile.y ); offset += 2;
	packet.WriteShort( offset, tile.x ); offset += 2;
	packet.WriteByte( offset, tile.stackLevel ); offset++;
	packet.WriteByte( offset, tile.direction ); offset++;
	packet.WriteByte( offset, tile.flipped == 1 ? 0x10 : 0x00 ); offset++;
	return offset;
}

function MahjongTileVisibleValue( viewer, board, tile )
{
	if( tile.flipped != 1 )
		return 0;

	var handArea = MahjongGetHandArea( tile.x, tile.y, tile.direction );
	if( handArea < 0 )
		return tile.value;

	if( board.GetTag( "mahjongPublic" + handArea ) == 1 )
		return tile.value;

	if( viewer != null && MahjongGetPlayerIndex( board, viewer ) == handArea )
		return tile.value;

	if( board.GetTag( "mahjongSpectatorVision" ) == 1 )
		return tile.value;

	return 0;
}

function MahjongGetPlayerIndex( board, pUser )
{
	for( var index = 0; index < mahjongMaxPlayers; index++ )
	{
		if( board.GetTag( "mahjongSeat" + index ) == pUser.serial )
			return index;
	}
	return -1;
}

function MahjongGetHandArea( x, y, direction )
{
	var dim = MahjongGetDim( x, y, direction );
	if( dim.y >= 25 && dim.y <= 90 )
		return 0;
	if( dim.x >= 555 && dim.x <= 620 )
		return 1;
	if( dim.y >= 555 && dim.y <= 620 )
		return 2;
	if( dim.x >= 25 && dim.x <= 90 )
		return 3;
	return -1;
}

function MahjongGetDim( x, y, direction )
{
	if( direction == MAHJONG_DIR_UP || direction == MAHJONG_DIR_DOWN )
		return { x:x, y:y, width:20, height:30 };
	return { x:x, y:y, width:30, height:20 };
}

// UOX3 has no WriteAsciiFixed helper, so write each byte and pad with 0.
function MahjongWriteAsciiFixed( packet, offset, text, length )
{
	var safeText = String( text );
	for( var index = 0; index < length; index++ )
	{
		if( index < safeText.length )
			packet.WriteByte( offset + index, safeText.charCodeAt( index ) & 0x7F );
		else
			packet.WriteByte( offset + index, 0 );
	}
}

function MahjongByteToHex( value )
{
	var text = value.toString( 16 ).toUpperCase();
	if( text.length < 2 )
		text = "0" + text;
	return text;
}
