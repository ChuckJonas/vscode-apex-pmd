import * as vscode from 'vscode';

export class AppStatus implements vscode.Disposable {
  private static readonly DEFAULT_COMMAND = 'workbench.actions.view.problems';
  private static readonly APP_THINKING_ICON = `$(clock)`;
  private static readonly APP_IS_OK_ICON = `$(check)`;
  private static readonly APP_HAS_ERR_ICON = `$(alert)`;

  private static _instance: AppStatus = null;
  private static _appName: string;
  static get _thinkingMsg(): string {
    return `${AppStatus._appName} ${AppStatus.APP_THINKING_ICON}`;
  }
  static get _errorsMsg(): string {
    return `${AppStatus._appName} ${AppStatus.APP_HAS_ERR_ICON}`;
  }
  static get _okMsg(): string {
    return `${AppStatus._appName} ${AppStatus.APP_IS_OK_ICON}`;
  }

  private _appStatus: vscode.StatusBarItem;
  private _isHidden: boolean;

  static setAppName(newAppName: string) {
    // should only be called once. Further calls change nothing
    AppStatus._appName = AppStatus._appName || newAppName;
  }

  static getInstance(): AppStatus {
    if (AppStatus._instance == null) {
      AppStatus._instance = AppStatus.create();
    }
    return AppStatus._instance;
  }

  static create(): AppStatus {
    return new AppStatus();
  }

  public constructor() {
    this._appStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 5);
    this._appStatus.text = AppStatus._okMsg;
    this._appStatus.command = AppStatus.DEFAULT_COMMAND;
    this._appStatus.show();
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      this._appStatus.hide();
      this._isHidden = true;
    } else {
      this._appStatus.show();
      this._isHidden = false;
    }
  }

  public show() {
    if (this._isHidden) {
      this._appStatus.text = AppStatus._okMsg;
      this._appStatus.show();
      this._isHidden = false;
    }
  }

  public hide() {
    this._appStatus.hide();
    this._isHidden = true;
  }

  public thinking(): void {
    this._appStatus.text = AppStatus._thinkingMsg;
  }

  public errors(): void {
    this._appStatus.text = AppStatus._errorsMsg;
  }

  public ok(): void {
    this._appStatus.text = AppStatus._okMsg;
  }

  dispose() {
    this._appStatus.dispose();
  }
}
