let instance;

export default class BitmapFont {
        constructor() {
                if (instance) {
                        return instance;
                }
                instance = this;
        }

        loadFont(jsonData, onloaded) {

                let bitmapFont = JSON.parse(jsonData);
                this.defaultSize = Math.abs(parseInt(bitmapFont.info.size));

                this.chars = {};
                bitmapFont.chars.char.forEach(ch => {
                        this.chars[String.fromCharCode(ch.id)] = ch;
                });

                this.bitmap = wx.createImage();
                this.bitmap.onload = function() {
                        onloaded();
                };
                this.bitmap.src = 'fonts/' + bitmapFont.pages.page.file;

        }
}