// Extension Samples: https://github.com/Microsoft/vscode-extension-samples
// Then (Promise) Usage: https://medium.com/patrickleenyc/things-to-keep-in-mind-while-writing-a-vs-code-extension-9f2a3369b799

import * as vscode from 'vscode';
import { PipelineJack } from './PipelineJack';
import { PipelineSnippets } from './snippets';
import { ScriptConsoleJack } from './ScriptConsoleJack';
import { BuildLogJack } from './BuildLogJack';
import { Jack } from './Jack';

export function activate(context: vscode.ExtensionContext) {

    var pipelineSnippets = new PipelineSnippets();
    console.log('Extension Jenkins Jack now active!');

    let snippetsDisposable = vscode.languages.registerCompletionItemProvider('groovy', {
        provideCompletionItems(
            document: vscode.TextDocument,
            position: vscode.Position,
            token: vscode.CancellationToken,
            context: vscode.CompletionContext) {
            return pipelineSnippets.completionItems;
        }
    });
    context.subscriptions.push(snippetsDisposable);

    let jacks: Jack[] = []

    let pipelineJack = new PipelineJack();
    jacks.push(pipelineJack);
	let pipelineDisposable = vscode.commands.registerCommand('extension.jenkins-jack.pipeline', async () => {
		try {
            await pipelineJack.displayCommands();
        } catch (err) {
            vscode.window.showWarningMessage('Could not display Pipeline commands.');
        }
	});
    context.subscriptions.push(pipelineDisposable);

    let scriptConsoleJack = new ScriptConsoleJack();
    jacks.push(scriptConsoleJack);
	let scriptConsoleDisposable = vscode.commands.registerCommand('extension.jenkins-jack.scriptConsole', async () => {
		try {
            await scriptConsoleJack.displayCommands();
        } catch (err) {
            vscode.window.showWarningMessage('Could not display Script Console commands.');
        }
	});
    context.subscriptions.push(scriptConsoleDisposable);

    let buildLogJack = new BuildLogJack();
    jacks.push(buildLogJack);
	let buildLogDisposable = vscode.commands.registerCommand('extension.jenkins-jack.buildLog', async () => {
		try {
            await buildLogJack.displayCommands();
        } catch (err) {
            vscode.window.showWarningMessage('Could not display Build Log commands.');
        }
	});
    context.subscriptions.push(buildLogDisposable);

	let jacksCommands = vscode.commands.registerCommand('extension.jenkins-jack.jacks', async () => {

        // Build up command list from all the Jacks.
        let commands: any[] = [];
        for (let j of jacks) {
            commands = commands.concat(j.getCommands());
        }

        // Display full list of all commands and execute selected target.
        let result = await vscode.window.showQuickPick(commands);
        if (undefined === result) { return; }
        await result.target();
	});
    context.subscriptions.push(jacksCommands);
}

export function deactivate() {}