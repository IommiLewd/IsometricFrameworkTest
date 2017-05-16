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

    _loadLevel() {
        this.game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        }
        this.game.stage.backgroundColor = "#1b2823";
        this.game.world.setBounds(0, 0, 800, 500);
        this.game.iso.anchor.setTo(0.5, 0);
        this.floorGroup = game.add.group();

        var floorTile;
        for (var xt = 110; xt < 356; xt += 81) {
            for (var yt = 110; yt < 356; yt += 81) {
                floorTile = game.add.isoSprite(xt, yt, 0, 'initialTileset', 0, this.floorGroup);
                floorTile.anchor.set(0.5);
                floorTile.selectionMade = false;
                var randomTile = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
                floorTile.frame = randomTile;
            }
        }
    }



//    _generateExtension() {
//    }



    preload() {

    }
    create() {
        this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        this.cursorPos = new Phaser.Plugin.Isometric.Point3();
        this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));
        this._loadLevel();
        //this._generateExtension();
        this.game.iso.simpleSort(this.floorGroup);
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
                console.log();

                if (tile.selected && inBounds) {

                    console.log(tile.frame);

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
    
    
    render(){
   
            this.game.debug.body(this.floorGroup);
    
    
    }
}