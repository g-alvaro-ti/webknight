# WebKnight

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-886FBF?style=for-the-badge&logo=googlebard&logoColor=white)
![Status](https://img.shields.io/badge/Status-Em%20desenvolvimento-yellow?style=for-the-badge)

RPG de combate em turnos desenvolvido em uma página web, para o curso Tecnologia em Sistemas para Internet.

Você acorda em uma floresta escura sem saber como chegou ali. Explore o mapa, encontre os inimigos que vagam pelo cenário e sobreviva às batalhas para avançar de região.

## Jogo até o momento

- **Tela inicial, tela de jogo, tela de batalha e tela de fim**, alternadas por seções na mesma página.
- **Mapa em grade de 10x15 células**, com piso, paredes com objetos decorativos, saída, inimigos e o jogador, renderizado dinamicamente a partir de uma matriz numérica.
- **Geração de mapa com IA (Google Gemini)**: a partir de uma chave de API informada na tela, o jogo pede ao Gemini uma matriz de mapa para um dos quatro cenários — Floresta, Cidade, Ruína ou Montanha — cada um com sua própria paleta de cores.
- **Mapa padrão de teste** carregado automaticamente ao abrir a página, pra não depender da API durante o desenvolvimento.
- **Movimentação do jogador** com WASD ou setas, suporte a segurar tecla, fila de toques rápidos pra não perder inputs, cooldown entre passos e sprites animados de parado/caminhada nas quatro direções.
- **Movimentação dos inimigos**: após cada movimento bem-sucedido do jogador, todos os inimigos tentam se deslocar aleatoriamente, mantendo o estado de cada entidade (posição + elemento na tela). Cada inimigo tem uma chance de permanecer parado no turno e nunca entra em paredes, sai dos limites do mapa, sobrepõe outros inimigos ou pisa no jogador.
- **Painel do jogador** lateral com atributos (vida, força, defesa, velocidade), região atual e contador de mapas visitados, colapsável em telas pequenas.
- **Classes de personagem** com herança (`Personagem` → `Jogador`, `Personagem` → `Inimigo` → `Vorax`), com atributos privados e getters/seters, prontas pra alimentar as batalhas em turnos.

## Controles

| Tecla                  | Ação                            |
| ---------------------- | ------------------------------- |
| `W` / `↑`              | Mover pra cima                  |
| `S` / `↓`              | Mover pra baixo                 |
| `A` / `←`              | Mover pra esquerda              |
| `D` / `→`              | Mover pra direita               |
| Segurar a tecla        | Caminha continuamente           |

## Em desenvolvimento

- Combate em turnos (interface e lógica já reservadas no layout).
- Atributos reais do jogador vindos das classes substituindo os dados de exemplo do painel.
- Narrativa dinâmica por região.
- Placar de líderes na tela de fim.
