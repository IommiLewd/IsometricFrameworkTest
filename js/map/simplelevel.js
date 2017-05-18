class SimpleLevel extends Phaser.State {
    constructor() {
        super();
    }

    _loadLevel(tiles) {
        this.game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this.game.stage.backgroundColor = "#1b2823";
        this.game.world.setBounds(0, 0, 1040, 540);
        this.game.iso.anchor.setTo(0.5, 0);
        this.floorGroup = game.add.group();
        this.camera.x = 200;
        this.camera.y = 90;
        var floorTile;
        var initialPosition = 60;
        var numberOfTiles = tiles;
        var tileWidth = 81;
        var totalLength = numberOfTiles * tileWidth + initialPosition;
        this.tiles = [
            0, 0, 0, 0, 0, 0, 0, //6
            0, 0, 1, 1, 1, 0, 0, //13
            0, 1, 2, 2, 2, 1, 0, //20
            0, 1, 2, 2, 2, 1, 0, //27
            0, 1, 2, 2, 2, 1, 0,
            0, 0, 1, 1, 1, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
        ];

        var i = 0;
        for (var yt = initialPosition; yt < totalLength; yt += tileWidth) {
            for (var xt = initialPosition; xt < totalLength; xt += tileWidth) {
                floorTile = game.add.isoSprite(xt, yt, 0, 'initialTileset', 0, this.floorGroup);
                floorTile.anchor.set(0.5);
                floorTile.selectionMade = false;
                floorTile.tileNumber = i;
                var randomTile = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
                floorTile.frame = 0;
                i++;
            }
        }
        this._sortTiles();

    }

    _sortTiles() {
        for (var i = 0; i < this.tiles.length; i++) {
            this.floorGroup.children[i].frame = this.tiles[i];
        }
        //this._tileLogger(); 
    }




    _buyTiles(place) {
        var up = place - 7;
        var down = place + 7;
        var left = place - 1;
        var right = place + 1;
        var roundedUp = (Math.ceil(place / 7) * 7 - 1);
        if (place > roundedUp) {
            roundedUp += 7;
        }
        console.log('place is: ' + place + ' rounded number is: ' + roundedUp);
        if (this.tiles[place] === 1) {
            this.tiles[place] = 2;

            if (this.tiles[up] === 0 /* && place <  roundedNumber + 1 && place >  roundedNumber - 1*/ ) {
                console.log('up');
                this.tiles[up] = 1;
            }
            if (this.tiles[down] === 0 /* && place <  roundedNumber + 1 && place >  roundedNumber - 1*/ ) {
                console.log('down');
                this.tiles[down] = 1;
            }

            if (this.tiles[left] === 0 && place > roundedUp - 6) {
                console.log('left ' + left);
                this.tiles[left] = 1;

            }

            if (this.tiles[right] === 0 && place < roundedUp) {
                console.log('right ' + right);
                this.tiles[right] = 1;
            }
        }
        this._sortTiles();
        this._tileLogger();

        //        console.log('   ' + this.tiles[up]);
        //        console.log(this.tiles[left] + '  ' + place + '(' + this.tiles[place] + ')' + '   ' + this.tiles[right]);
        //        console.log('   ' + this.tiles[down]);
    }









    _tileLogger() {
        var s = "";
        var k = 0;
        for (var i = 0; i < this.tiles.length; i++) {
            if (i % 7 === 0 && i != 0) {
                s += '\n';
            }
            s += this.tiles[i] + ' ';
        }
        console.log(s);
    }

    preload() {}

    create() {
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
        this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
        this._loadLevel(7);
        //this.game.iso.simpleSort(this.floorGroup);
        this._tileLogger();
    }
    update() {

        this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos, +44);
        this.floorGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds && tile.frame !== 0) {
                tile.selected = true;
                this.game.add.tween(tile).to({
                    isoZ: 6
                }, 200, Phaser.Easing.Quadratic.InOut, true);
            }

            if (this.game.input.activePointer.isDown) {
                this._sortTiles();

                if (tile.selected && inBounds) {
                    console.log('selected tile: ' + tile.tileNumber);

                    if (tile.frame === 1) {
                        //   tile.frame = 1;
                        //this._buyTiles(tile);
                        this._buyTiles(tile.tileNumber);
                    }
                }

                tile.tint = 0x86bfda;
                tile.selectionMade = true;
                if (!tile.selected || !inBounds) {
                    tile.tint = 0xffffff;
                    tile.selectionMade = false;
                }
            }

            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                if (this.selectionMade === true) {
                    tile.tint = 0xffffff;
                }
                this.game.add.tween(tile).to({
                    isoZ: 0
                }, 200, Phaser.Easing.Quadratic.InOut, true);
            }

        }, this);

        if (this.game.input.activePointer.isDown) {
            if (this.game.origDragPoint) {
                // move the camera by the amount the mouse has moved since last update		
                this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
            }
            // set new drag origin to current position	
            this.game.origDragPoint = this.game.input.activePointer.position.clone();
        } else {
            this.game.origDragPoint = null;
        }

    }

}








//    _buyTiles(place){
//        console.log('BuyTiles fired');
//    var up = place  - 7;
//    var down = place + 7;
//    var left = place - 1;
//    var right = place + 1;
////    if(this.tiles[place] === 1){
////      this.tiles[place] = 2;
//////      console.log('   ' + this.tiles[up]);
//////      console.log(this.tiles[left] + '  ' + place + '(' + this.tiles[place] + ')' + '   ' + this.tiles[right]);
//////      console.log('   ' + this.tiles[down]);
////      if(this.tiles[up]  === 0){
////          this.tiles[up] = 1;
////      }
////            if(this.tiles[down]  === 0){
////          this.tiles[down] = 1;
////      }
////      
////            if(this.tiles[left]  === 0){
////          this.tiles[left] = 1;
////      }
////      
////            if(this.tiles[right]  === 0){
////        this.tiles[right] = 1;
////      }
////    }
////this._sortTiles();
//        this._tileLogger();
//        this._sortTiles();
//}