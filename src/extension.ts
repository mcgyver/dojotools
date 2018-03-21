'use strict';

import * as vscode from 'vscode';

import RoundManager = require('./roundManager');



export function activate(context: vscode.ExtensionContext) {

    const getConfiguration = () => vscode.workspace.getConfiguration('dojotools');

    let time = getConfiguration().time;

    let manager = new RoundManager(time || 300);

    let start = vscode.commands.registerCommand('extension.startRoundDojo', () => {
        manager.resume();
        vscode.window.showInformationMessage('Start Dojo!');
    });

    let stop = vscode.commands.registerCommand('extension.stopRoundDojo', () => {
        manager.stop();
        vscode.window.showInformationMessage('Stop Dojo!');
    });

    let reset = vscode.commands.registerCommand('extension.resetRoundDojo', () => {
        manager.reset();
        vscode.window.showInformationMessage('Reset Dojo');
    });

    context.subscriptions.push(start, stop, reset);
}

export function deactivate() {
}