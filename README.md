# Sistema de Gestão de Dados Mauro - Webapp

Uma aplicação web moderna em português para interagir com o Mauro Data Mapper API.

## Funcionalidades

- 🔐 **Autenticação segura** - Sistema de login com tokens JWT
- 📋 **Menu principal** - Dashboard com ações rápidas e submissões recentes
- 📝 **Formulário de submissão** - Interface completa para submeter novos dados
- 📊 **Visualização de submissões** - Lista de submissões recentes com status
- 🎨 **Interface moderna** - Design responsivo e intuitivo em português
- 🔄 **Integração API** - Conecta diretamente ao Mauro Data Mapper

## Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React Hook Form** - Gestão de formulários
- **Zustand** - Gestão de estado
- **Axios** - Cliente HTTP para API
- **CSS Modules** - Estilização moderna

## Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Mauro Data Mapper API acessível

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd webapp-mdm
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env.local na raiz do projeto
NEXT_PUBLIC_MDM_API_URL=http://localhost:8080/api
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── login/             # Página de login
│   ├── menu/              # Menu principal
│   ├── submit/            # Formulário de submissão
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial (redirecionamento)
├── components/            # Componentes reutilizáveis
│   └── ProtectedRoute.tsx # Componente de rota protegida
├── lib/                   # Utilitários e configurações
│   ├── api.ts            # Cliente API para Mauro Data Mapper
│   └── auth-store.ts     # Store de autenticação (Zustand)
└── styles/               # Estilos globais
```

## Configuração da API

A aplicação está configurada para conectar ao Mauro Data Mapper através dos seguintes endpoints:

### Autenticação
- `POST /api/v1/auth/login` - Login de utilizador
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Informações do utilizador atual

### Submissões
- `GET /api/v1/submissions/recent` - Submissões recentes
- `POST /api/v1/submissions` - Criar nova submissão
- `GET /api/v1/submissions/:id` - Obter submissão específica
- `PUT /api/v1/submissions/:id` - Atualizar submissão
- `DELETE /api/v1/submissions/:id` - Eliminar submissão

### Modelos de Dados
- `GET /api/v1/dataModels` - Listar modelos de dados
- `GET /api/v1/dataModels/:id` - Obter modelo específico

## Utilização

### 1. Login
- Aceda à aplicação e será redirecionado para a página de login
- Introduza as suas credenciais do Mauro Data Mapper
- Após login bem-sucedido, será redirecionado para o menu principal

### 2. Menu Principal
- **Ações Rápidas**: Aceda ao formulário de submissão
- **Submissões Recentes**: Visualize as últimas 5 submissões
- **Terminar Sessão**: Faça logout da aplicação

### 3. Submeter Formulário
- Preencha o título e descrição da submissão
- Selecione o tipo de dados (JSON, XML, CSV, etc.)
- Introduza o conteúdo dos dados
- Defina a prioridade (Baixa, Média, Alta)
- Submeta o formulário

## Personalização

### Alterar Idioma
A aplicação está configurada em português (pt-PT). Para alterar:

1. Modifique `lang="pt-PT"` em `src/app/layout.tsx`
2. Atualize todos os textos nas páginas

### Alterar Estilos
Os estilos estão definidos em `src/app/globals.css` com variáveis CSS personalizáveis:

```css
:root {
  --primary-color: #2563eb;
  --background-color: #f8fafc;
  /* ... outras variáveis */
}
```

### Configurar API
Edite `src/lib/api.ts` para ajustar:
- URL base da API
- Endpoints específicos
- Headers personalizados
- Interceptors de requisição/resposta

## Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

## Troubleshooting

### Erro de CORS
Se encontrar erros de CORS, certifique-se de que o Mauro Data Mapper está configurado para aceitar requisições do domínio da aplicação.

### Erro de Autenticação
Verifique se as credenciais estão corretas e se o endpoint de autenticação está acessível.

### Problemas de Rede
Confirme que o `NEXT_PUBLIC_MDM_API_URL` está configurado corretamente e acessível.

## Contribuição

1. Fork o projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit as suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Para questões ou problemas, abra uma issue no repositório do projeto.
