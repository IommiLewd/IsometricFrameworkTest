/**
 * base class for a simple game level.
 *
 * @constructor  {}
 * @method   :
 * @property :
 * startPosition {} (x,y)
 */

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
        this.extensionGroup = game.add.group();
        this.camera.x = 200;
        this.camera.y = 90;
        var floorTile;
        var extensionTile;
        var initialPosition = 60;
        var numberOfTiles = tiles;
        var tileWidth = 81;
        var totalLength = numberOfTiles * tileWidth + initialPosition;



        this.tiles = [
            8, 8, 8, 8, 8, 8, 8,
            8, 8, 0, 0, 0, 8, 8,
            8, 0, 1, 1, 1, 0, 8,
            8, 0, 1, 1, 1, 0, 8,
            8, 0, 1, 1, 1, 0, 8,
            8, 8, 0, 0, 0, 8, 8,
            8, 8, 8, 8, 8, 8, 8,
        ];

        var i = 0;
        for (var yt = initialPosition; yt < totalLength; yt += tileWidth) {
            for (var xt = initialPosition; xt < totalLength; xt += tileWidth) {
                if (this.tiles[i] != 8) {
                    floorTile = game.add.isoSprite(xt, yt, 0, 'initialTileset', 0, this.floorGroup);
                    floorTile.anchor.set(0.5);
                    floorTile.selectionMade = false;
                    floorTile.tileNumber = i;
                    var randomTile = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
                    floorTile.frame = this.tiles[i];
                }
                i++;
            }
        }
    }

    _tileLogger() {
        var s = "";
        var k = 0;
        for (var i = 0; i < this.tiles.length; i++) {
            // for(var i = this.tiles.length; i > 0; i--){


            if (i % 7 === 0 && i != 0) {
                s += '\n';
            }


            s += this.tiles[i] + ' ';
            //s += i  + ' ';


        }
        console.log(s);
    }

    _generateExtensions(position, tiles, width) {
        console.log('generate Extensions!!!');
        var xx = width * tiles + position;
        var yy = position;
        //var yy = width * tiles + position;
        //xx =  tiles * width/* + position*//* - 30*/;
        //yy =  tiles * width + position - 82;
        this.extension = this.game.add.isoSprite(xx, yy, 0, 'initialTileset', 0);

        this.extension.anchor.set(0.5);
    }



    preload() {

    }
    create() {
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
        this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
        this._loadLevel(7);
        //this._generateExtension();
       this.game.iso.simpleSort(this.floorGroup);
        this._tileLogger();
    }
    update() {
 
        this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos, +44);
        this.floorGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {

                tile.selected = true;
                this.game.add.tween(tile).to({
                    isoZ: 6
                }, 200, Phaser.Easing.Quadratic.InOut, true);
            }

            if (this.game.input.activePointer.isDown) {


                if (tile.selected && inBounds) {
                    console.log(tile.tileNumber);
                    if (tile.frame === 0) {
                        tile.frame = 1;
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


    render() {

        this.game.debug.body(this.floorGroup);


    }
}