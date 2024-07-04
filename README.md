# Sonassi OpenVPN Connection GitHub Action

The Sonassi OpenVPN Connection GitHub Action allows you to establish a secure connection to a Sonassi VPN server within your GitHub Actions workflow.

To use this action, you need to provide the necessary configuration details for your Sonassi VPN server. This includes the configuration file, certificate, and certificate name. 

## Inputs

- `config`: The config file provided in the VPN bundle for Linux. (required)
- `certificate`: The p12 file provided in the VPN bundle for Linux. (required)
- `certificate_name`: The p12 filename as configured inside the config file (required)

## Example Usage

```yaml
- name: Connect to Sonassi VPN
    uses: sozo-design/actions-sonassi-openvpn-connection@v1
    with:
        config: ${{ secrets.VPN_SERVER_CONFIG }}
        certificate: ${{ secrets.VPN_CERTIFICATE }}
        certificate_name: ${{ secrets.VPN_CERTIFICATE_NAME }}
```

Make sure to store your sensitive information (such as the config, certificate, and certificate_name) as secrets in your GitHub repository to keep them secure.

For more information on how to use this action, please refer to the [GitHub Action documentation](https://docs.github.com/actions).

