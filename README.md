# Sonassi OpenVPN Connection GitHub Action

The Sonassi OpenVPN Connection GitHub Action allows you to establish a secure connection to a Sonassi VPN server within your GitHub Actions workflow.

To use this action, you need to provide the necessary configuration details for your Sonassi VPN server. This includes the configuration file, certificate, certificate name, and optional tmp_dir name. 

## Inputs

- `config`: The config file provided in the VPN bundle for Linux. (required)
- `certificate`: The p12 file provided in the VPN bundle for Linux. (required)
- `certificate_name`: The p12 filename as configured inside the config file (required)
- `tmp_dir`: The directory to save the certificate and config to defaults to `/tmp`

## Example Usage

```yaml
- name: Connect to Sonassi VPN
    uses: sozo-design/actions-sonassi-openvpn-connection@v1
    with:
        config: ${{ secrets.VPN_SERVER_CONFIG }}
        certificate: ${{ secrets.VPN_CERTIFICATE }}
        certificate_name: ${{ secrets.VPN_CERTIFICATE_NAME }}
        tmp_dir: "/tmp"

- name: Wait for VPN to connect
    if: success()
    run: until ping -c 1 -W 5 172.16.0.61; do sleep 2; done

- name: Upload VPN logs
    if: always()
    uses: actions/upload-artifact@v4
    with:
        name: vpn-logs
        path: openvpn.log
```

Make sure to store your sensitive information (such as the config, certificate, and certificate_name) as secrets in your GitHub repository to keep them secure. 

The certificate will need to be converted to base 64 before you can save the value as a GitHub secret.

```shell
# Mac/Linux
base64 <file_name> > output.txt

# Windows
certutil -encode <file_name> output.txt
```
Replace `<file_name>` with the name of the file you want to encode. The encoded output will be saved in `output.txt`.

Remember to replace `<file_name>` with the actual name of the file you want to encode.

The optional `Upload VPN logs` step allows you to see logs from the OpenVPN process and debug where needed.

For more information on how to use this action, please refer to the [GitHub Action documentation](https://docs.github.com/actions).
