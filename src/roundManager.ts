import { DojoStatus } from './dojoStatus';
import { window, StatusBarAlignment, StatusBarItem } from 'vscode';
import * as vscode from 'vscode';

class RoundManager {
    private seconds: number = 0;
    private toggleOnOff: boolean = false;
    private timing: any = undefined;
    private time: number = 0;
    private toolTip: string = "Start Dojo";
    private icon: string = `$(triangle-right) `;
    private statusBarText: StatusBarItem;
    private dojoStatus: DojoStatus = DojoStatus.Stoped;
    private text: string = "";


    constructor(time: number) {
        this.time = time;
        this.seconds = time;
        this.statusBarText = window.createStatusBarItem(StatusBarAlignment.Left);
        this.statusBarText.show();
        this.text = "Stoped";
        this.updateDisplay();
    }

    public resume() {
        if (!this.toggleOnOff) {
            this.text = "Running";
            this.toggleOnOff = true;
            this.dojoStatus = DojoStatus.Working;
            this.toolTip = "Stop Dojo";
            this.icon = `$(primitive-square)`;
            this.statusBarText.command = 'extension.stopRoundDojo';
            this.countingSeconds();
        }
    }

    public stop() {
        this.text = "Paused";
        clearTimeout(this.timing);
        this.toggleOnOff = false;
        this.icon = `$(triangle-right) `;
        this.dojoStatus = DojoStatus.Stoped;
        this.toolTip = "Start Dojo";
        this.updateDisplay();
    }

    public reset() {
        const getConfiguration = () => vscode.workspace.getConfiguration('dojotools');
        this.time = Number.parseInt(getConfiguration().time);
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

        this.statusBarText.text = `${this.icon} ${str_minutes}:${str_seconds} - ${this.text}`;
        this.statusBarText.tooltip = this.toolTip;
        if(this.dojoStatus === DojoStatus.Stoped) {
            this.statusBarText.command = 'extension.startRoundDojo';
        }else {
            this.statusBarText.command = 'extension.stopRoundDojo';
        }
        /*if(this.dojoStatus === DojoStatus.Stoped) {
            this.statusBarText.text = `$(triangle-right)  ${this.statusBarText.text}`;
            this.statusBarText.command = 'extension.startRoundDojo';
            this.statusBarText.tooltip = 'Start Dojo';
        }else if(this.dojoStatus === DojoStatus.Working) {
            this.statusBarText.text = `$(primitive-square)  ${this.statusBarText.text}`;
            this.statusBarText.command = 'extension.stopRoundDojo';
            this.statusBarText.tooltip =  'Stop Dojo';
        }*/
    }
}

export = RoundManager;