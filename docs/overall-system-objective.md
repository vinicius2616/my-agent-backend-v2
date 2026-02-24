# My Agent

# Objetivo Global do Sistema — My Agent

## Objetivo do My Agent

O **My Agent** é um **webapp mobile first** que atua como um **assistente pessoal digital**, organizado em **módulos**, com o objetivo de **centralizar, registrar, acompanhar e notificar informações relevantes da vida do usuário** em um único sistema.

O produto foi concebido para reduzir a fragmentação de ferramentas e assumir o papel de **ponto central de organização pessoal**, permitindo que o usuário gerencie diferentes aspectos da sua rotina sem depender de múltiplos aplicativos desconectados.

---

## Problema que o sistema resolve

Atualmente, o usuário precisa lidar com diferentes aplicações para:

- Controlar finanças
- Anotar lembretes
- Gerenciar compromissos
- Acompanhar agenda
- Registrar informações rápidas (mensagens, notas, etc.)

Essas ferramentas:

- Não compartilham contexto entre si
- Exigem esforço manual constante
- Não oferecem uma visão consolidada
- Dependem da memória e atenção do usuário

O My Agent existe para **centralizar essas responsabilidades** em um único sistema, onde os dados convivem, se relacionam e podem ser apresentados de forma resumida e contextual.

---

## Conceito central do sistema

O My Agent é estruturado como um **assistente pessoal modular**, onde cada módulo resolve um domínio específico, mas todos se conectam por meio de um **módulo central**.

O sistema deve ser entendido como:

- Um único produto
- Com múltiplos módulos
- Que compartilham dados, contexto e visão

Não são produtos separados, nem funcionalidades isoladas.

---

## Estrutura conceitual do sistema

O sistema é composto pelos seguintes módulos, todos integrados ao **Módulo Central (Dashboard)**:

### Módulo Central — Dashboard

O **Módulo Central** é o ponto de entrada do sistema.

Responsabilidades:

- Exibir um **resumo consolidado** dos demais módulos
- Apresentar informações de forma clara e sintetizada
- Servir como visão geral da situação atual do usuário

Este módulo **não é apenas visual**, ele representa o conceito de:

> “Estado atual da vida do usuário dentro do My Agent”.
> 

---

### Módulo de Finanças

Responsável por:

- Registro de despesas e receitas
- Organização financeira mensal
- Classificação por categorias
- Acompanhamento de valores ao longo do tempo

Este módulo alimenta o sistema com dados financeiros que podem ser:

- Visualizados isoladamente
- Resumidos no dashboard
- Utilizados em notificações e lembretes futuros

---

### Módulo de Lembretes

Responsável por:

- Registro de lembretes
- Definição de datas, horários e recorrências
- Notificação do usuário no momento adequado

Os lembretes podem estar relacionados a:

- Finanças (ex: contas)
- Compromissos
- Eventos pessoais
- Qualquer informação que precise ser lembrada

---

### Módulo de Agenda

Responsável por:

- Gerenciar compromissos e eventos
- Integrar com agendas externas (ex: Google Agenda)
- Sincronizar eventos com o My Agent

Este módulo permite que o sistema:

- Conheça a disponibilidade do usuário
- Centralize compromissos externos
- Exiba eventos dentro do contexto geral do sistema

---

### Integração com WhatsApp

Responsável por permitir que o usuário:

- Registre informações diretamente pelo WhatsApp
- Crie lembretes, eventos de agenda ou registros financeiros
- Interaja com o sistema fora do webapp

Essa integração atua como um **canal de entrada de dados**, não como um sistema separado.

---

## Relação entre os módulos

Todos os módulos:

- Compartilham o mesmo usuário
- Alimentam o Módulo Central
- Podem gerar notificações
- Devem ser pensados de forma integrada

Nenhum módulo deve ser projetado como:

- Independente
- Isolado
- Sem impacto no restante do sistema

---

## Princípios que guiam o desenvolvimento

Este objetivo define que:

- O sistema é **mobile first**
- A experiência deve ser simples e direta
- O foco é **organização e acompanhamento**
- O My Agent atua como um **assistente**, não apenas um repositório de dados
- O produto deve ser **extensível**, permitindo novos módulos no futuro