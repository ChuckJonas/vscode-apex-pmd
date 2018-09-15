import * as vscode from 'vscode';

export class AppStatus implements vscode.Disposable{
    private static readonly APP_NAME = 'ApexPMD';
    private static readonly DEFAULT_COMMAND = 'workbench.actions.view.problems';
    private static readonly APP_THINKING_MSG = `${AppStatus.APP_NAME} $(clock)`;
    private static readonly APP_IS_OK_MSG = `${AppStatus.APP_NAME} $(check)`;
    private static readonly APP_HAS_ERR_MSG = `${AppStatus.APP_NAME} $(alert)`;

    private static _instance: AppStatus = null;

    private _appStatus: vscode.StatusBarItem;

    static getInstance(): AppStatus {
        if(AppStatus._instance == null){
            AppStatus._instance = AppStatus.create();
        }
        return AppStatus._instance;
    }

    static create(): AppStatus {
        return new AppStatus();
    }

    public constructor() {
        this._appStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 5);
        this._appStatus.text = AppStatus.APP_IS_OK_MSG;
        this._appStatus.command = AppStatus.DEFAULT_COMMAND;
        this._appStatus.show();
    }

    public thinking(): void{
        this._appStatus.text = AppStatus.APP_THINKING_MSG;
    }

    public errors(): void{
        this._appStatus.text = AppStatus.APP_HAS_ERR_MSG;
    }

    public ok(): void{
        this._appStatus.text = AppStatus.APP_IS_OK_MSG;
    }

    dispose(){
        this._appStatus.dispose();
    }
}
