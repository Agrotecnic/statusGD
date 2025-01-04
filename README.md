# Status GD

// ...existing code...

## Configuração do Firebase Admin

Em produção, você precisará configurar as credenciais do Firebase Admin SDK:

1. No Console do Firebase, vá para Configurações > Contas de serviço
2. Clique em "Gerar nova chave privada"
3. Salve o arquivo JSON
4. Configure a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS apontando para este arquivo:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
```

Para desenvolvimento local, você pode ignorar o aviso do Firebase Admin.

// ...existing code...
