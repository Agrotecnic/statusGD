
#!/bin/bash

# Define ambiente de teste
export NODE_ENV=test

# Executa os testes com configuração explícita
jest --config=jest.config.js "$@"