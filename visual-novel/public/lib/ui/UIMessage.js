// The UIMessage is the following:
// its message bubble that can have its colour set.
// it has text label who the speaker is.
// it has text for japanese dialog.
// it has text for english dialog
class UIMessage extends UIItem{
    constructor(scene,options) {
        super('message')

        this.scene = scene;
        this.validateOptions(options); 
        this.x = options.position[0];
        this.y = options.position[1];

        const width = this.scene.cameras.main.width;
        this.maxWidth = width / 2;
        this.japaneseText = null;
        this.englishText = null;
        this.nameText = null;
        this.create();
    }

    create() {
        this.createBubble();
        this.createNameText();
        this.createJapaneseText();
        this.createEnglishText();
        this.createPlayButton();
    }

    registerEvents() {
        this.g.eventBus.on('ui:sentence:reset-highlighting', this.resetHighlighting, this);
        this.g.eventBus.on('ui:sentence:update-highlighting', this.updateHighlighting, this);
    }

    // Update word highlighting based on current audio time
    updateHighlighting() {
        if (!this.isPlaying || !this.currentAudio) return;
        
        const currentTime = this.currentAudio.seek;
        
        // Check each word's time range
        for (let i = 0; i < this.wordsData.length; i++) {
          const wordData = this.wordsData[i];
          const wordObject = this.words[i];
          
          // If current time is within this word's time range
          if (currentTime >= wordData.start && currentTime <= wordData.end) {
            wordObject.setColor(this.highlightColor);
          } else {
            wordObject.setColor(this.normalColor);
          }
        }
      }

    resetHighlighting() {
        for (let i = 0; i < this.words.length; i++) {
            if (i < this.wordsData.length) {
            this.words[i].setColor(this.normalColor);
            }
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.bubblePanel.setPosition(this.x, this.y);
    }    

    update(options){
        this.nameText.setText(options.name);
        if (options.japaneseText) {
            this.japaneseText.setText(options.japaneseText);
            this.japaneseText.setVisible(true);
        } else {
            this.japaneseText.setText('');
            this.japaneseText.setVisible(false);
        }
        if (options.englishText) {
            this.englishText.setText(options.englishText);
            this.englishText.setVisible(true);
        } else {
            this.englishText.setText('');
            this.englishText.setVisible(false);
        }
        this.bubblePanel.autoResizePanel();
    }

    createBubble() {
        this.bubblePanel = this.scene.g.ui.createPanel({
            position: [this.x, this.y],
            layout: 'vertical',
            spacing: 8,
            padding: 16,
            origin: [0,0],
            panelOptions: {
                backgroundImage: 'black-sq'
            }
        });
    }

    createPlayButton(){
        this.playButton = this.scene.g.ui.createButton({
            position: [0,0],
            image: 'play-button',
            image_hover: 'play-button',
            text: '',
            size: [64,64],
            eventHandle: 'dialog-play'
        })
        this.bubblePanel.addItem(this.playButton);
    }

    createNameText() {
        this.nameText = this.scene.g.ui.createLabel({
            position: [0,0],
            text: '',
            style: {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        });
        this.bubblePanel.addItem(this.nameText);
    }

    createJapaneseText() {
        const width = this.scene.cameras.main.width * 0.8;
        this.japaneseText = this.scene.g.ui.createLabel({
            position: [0,0],
            text: '',
            style: {
                fontFamily: 'Noto Sans JP',
                fontSize: '32px',
                color: '#ffffff',
                wordWrap: { width: width, useAdvancedWrap: true }
            }
        });
        this.bubblePanel.addItem(this.japaneseText);
    }

    createEnglishText() {
        const width = this.scene.cameras.main.width * 0.8;
        this.englishText = this.scene.g.ui.createLabel({
            position: [0,0],
            text: '',
            style: {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#808080',
                wordWrap: { width: width, useAdvancedWrap: true }
            }
        });
        this.bubblePanel.addItem(this.englishText);
    }

    validateOptions(options) {
        // Validate position
        if (!options.position) {
            throw new Error('Position is required');
        }
        if (!Array.isArray(options.position) || options.position.length !== 2 ||
            typeof options.position[0] !== 'number' || typeof options.position[1] !== 'number') {
            throw new Error('Position must be an array of two numbers');
        }
    }

    getDimensions() {
        // TODO - if the item is not visible, show this return 0,0?
        // What should happen in this case?
        return this.bubblePanel.getDimensions();
    }
}

if (typeof module !== 'undefined') {  
    module.exports = UIMessage;
}