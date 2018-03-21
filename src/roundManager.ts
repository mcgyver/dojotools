import { window, StatusBarAlignment, StatusBarItem } from 'vscode';

class RoundManager {
    private seconds: number = 0;
    private toggleOnOff: boolean = false;
    private timing: any = undefined;
    private time: number = 0;

    private _statusBarText: StatusBarItem;

    private text: string = "";


    constructor(time: number) {
        this.time = time;
        this.seconds = time;

        this._statusBarText = window.createStatusBarItem(StatusBarAlignment.Left);
        this._statusBarText.show();
    }

    public resume() {
        if (!this.toggleOnOff) {
            this.text = "Running";
            this.toggleOnOff = true;
            this.countingSeconds();
        }
    }

    public stop() {
        this.text = "Paused";
        clearTimeout(this.timing);
        this.toggleOnOff = false;
    }

    public reset() {
        this.text = "Not Running";
        this.seconds = this.time;
        this.updateDisplay();
    }

    private countingSeconds() {
        this.timing = setTimeout(() => {this.countingSeconds();}, 1000);
        this.seconds = this.seconds - 1;
        if(this.seconds < 0) {
            this.stop();
            window.showInformationMessage('Round Finish. New Round?', 'Yes', 'No')
                .then(result => {
                    if(result === 'Yes') {
                        this.reset();
                        this.resume();
                    }else {
                        this.reset();
                    }
                });
        }else {
            this.updateDisplay();
        }
    }

    private updateDisplay() {
        let minutes = Math.floor(this.seconds / 60);
        let seconds = this.seconds - minutes * 60;

        let str_minutes = minutes < 10 ? `0${minutes}` : minutes;
        let str_seconds = seconds < 10 ? `0${seconds}` : seconds;

        this._statusBarText.text = `${str_minutes}:${str_seconds} - ${this.text}`;
    }
}

export = RoundManager;