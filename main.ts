import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface CapoZettelPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CapoZettelPluginSettings = {
	mySetting: 'default'
}

export default class CapoZettelPlugin extends Plugin {
	settings: CapoZettelPluginSettings;
	private mode: string = "NORMAL";
	private statusBarItemEl: HTMLElement;

	private setMode(mode: string){
		this.mode = mode;
		this.updateStatus();
	}

	private updateStatus() {
		this.statusBarItemEl.setText(`-- ${this.mode} --`);
	}

	async onload() {
		await this.loadSettings();

		this.statusBarItemEl = this.addStatusBarItem();
		this.updateStatus();

		const modes = ["NORMAL","TMP","REF","SRC"];
		for (const mode of modes) {
			this.addCommand({
				id: `${mode.toLowerCase()}-mode`,
				name: `${mode} Mode`,
				callback: () => this.setMode(mode),
			});
		}

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: CapoZettelPlugin;

	constructor(app: App, plugin: CapoZettelPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
