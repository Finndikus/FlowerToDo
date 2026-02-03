import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export async function GET() {
    try {
        // PowerShell command to open a Save File Dialog
        // We use a small C# snippet to ensure the dialog can be shown even from a background process
        const psCommand = `
Add-Type -AssemblyName System.Windows.Forms
$form = New-Object System.Windows.Forms.Form
$form.TopMost = $true
$f = New-Object System.Windows.Forms.SaveFileDialog
$f.Filter = "JSON Files (*.json)|*.json|All Files (*.*)|*.*"
$f.DefaultExt = "json"
$f.AddExtension = $true
$f.Title = "Select Autosave Location"
$f.InitialDirectory = [Environment]::GetFolderPath("MyDocuments")
if ($f.ShowDialog($form) -eq [System.Windows.Forms.DialogResult]::OK) {
    $f.FileName
}
`;

        // Execute PowerShell command
        // -NoProfile: Don't load user profile (faster)
        // -ExecutionPolicy Bypass: Allow script execution
        // -Sta: Single Threaded Apartment (required for GUI)
        // -Command: The command to run
        const command = `powershell -NoProfile -ExecutionPolicy Bypass -Sta -Command "${psCommand.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`;

        console.log("Executing file picker command...");
        const { stdout, stderr } = await execAsync(command);

        if (stderr) {
            console.error("PowerShell stderr:", stderr);
        }

        const filePath = stdout.trim();
        console.log("File picker result:", filePath);

        if (!filePath) {
            return NextResponse.json({ cancelled: true });
        }

        return NextResponse.json({ filePath });
    } catch (error: any) {
        console.error("File picker error:", error);
        return NextResponse.json(
            { error: "Failed to open file picker", details: error.message || String(error) },
            { status: 500 }
        );
    }
}
