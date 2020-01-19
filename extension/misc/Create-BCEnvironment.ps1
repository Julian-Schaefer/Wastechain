$module = Get-InstalledModule -Name navcontainerhelper -ErrorAction Ignore
if ($module) {
    $versionStr = $module.Version.ToString()
    Write-Host "NavContainerHelper $VersionStr is installed"
    Write-Host "Determine latest NavContainerHelper version"
    $latestVersion = (Find-Module -Name navcontainerhelper).Version
    $latestVersionStr = $latestVersion.ToString()
    Write-Host "NavContainerHelper $latestVersionStr is the latest version"
    if ($latestVersion -gt $module.Version) {
        Write-Host "Updating NavContainerHelper to $latestVersionStr"
        Update-Module -Name navcontainerhelper -Force -RequiredVersion $latestVersionStr
        Write-Host "NavContainerHelper updated"
    }
} else {
    if (!(Get-PackageProvider -Name NuGet -ListAvailable -ErrorAction Ignore)) {
        Write-Host "Installing NuGet Package Provider"
        Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.208 -Force -WarningAction Ignore | Out-Null
    }
    Write-Host "Installing NavContainerHelper"
    Install-Module -Name navcontainerhelper -Force
    $module = Get-InstalledModule -Name navcontainerhelper -ErrorAction Ignore
    $versionStr = $module.Version.ToString()
    Write-Host "NavContainerHelper $VersionStr installed"
}

# Optional: Import License File
#Import-NavContainerLicense -containerName RC -licenseFile "PATH TO .flf"

$secpasswd = ConvertTo-SecureString "Testpassword123" -AsPlainText -Force
$credentials = New-Object System.Management.Automation.PSCredential ("testuser", $secpasswd)

New-NavContainer -containerName OrderingOrg `
    -accept_eula `
    -accept_outdated `
    -auth "NavUserPassword" `
    -credential $credentials `
    -imageName "mcr.microsoft.com/businesscentral/onprem:1910" `
    -bakFile "https://csbe7aa018c6d87x490dxb26.file.core.windows.net/tegos/OrderingOrg_BC.bak?st=2020-01-19T12%3A29%3A55Z&se=2020-11-20T12%3A29%3A00Z&sp=r&sv=2018-03-28&sr=f&sig=xuoqz1V7%2BmPkEcykYC1YLtojqZJguCuraIT6Tg%2B0GD8%3D" `
    -updateHosts `
    -shortcuts "None"


New-NavContainer -containerName SubcontractorOrg `
    -accept_eula `
    -accept_outdated `
    -auth "NavUserPassword" `
    -credential $credentials `
    -imageName "mcr.microsoft.com/businesscentral/onprem:1910" `
    -bakFile "https://csbe7aa018c6d87x490dxb26.file.core.windows.net/tegos/SubcontractorOrg_BC.bak?st=2020-01-19T12%3A31%3A04Z&se=2020-10-20T12%3A31%3A00Z&sp=rl&sv=2018-03-28&sr=f&sig=Sl2DiAoLHwft7FRmPeg7Qwrwj2Uq6V9CuO%2BC77IUD7I%3D" `
    -updateHosts `
    -shortcuts "None"

