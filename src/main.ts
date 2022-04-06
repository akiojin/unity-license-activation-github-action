import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as os from 'os'
import * as tmp from 'tmp'
import * as fs from 'fs/promises'
import { Unity, UnityCommandBuilder } from '@akiojin/unity-command'

async function Run()
{
	try {
		const builder = new UnityCommandBuilder()
	
		if (!!core.getInput('serial')) {
			builder.Activation(
				core.getInput('username'),
				core.getInput('password'),
				core.getInput('serial'))
		} else {
			const path = tmp.tmpNameSync()
			await fs.writeFile(path, Buffer.from(core.getInput('ulf-file-base64'), 'base64'))

			builder.ActivationForFile(
				core.getInput('username'),
				core.getInput('password'),
				path)
		}

		core.startGroup('Run Unity')
		await exec.exec(Unity.GetExecutePath(os.platform()), builder.Build())
		core.endGroup()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

Run()
