import React from "react";
import "./Rules.css";

const Rules = () => {
  return (
    <div className="menu-container">
      <div className="rules-container">
        <h1>Rules of Coup</h1>
        <span></span>
        <h2>Contents</h2>
        <p>
          15 character cards (3 each of Duke, Assassin, Captain, Ambassador,
          Contessa) 6 summary cards 50 coins Rules
        </p>
        <h2>Goal</h2>
        <p>
          To eliminate the influence of all other players and be the last
          survivor.
        </p>
        <h2>Influences</h2>
        <p>
          Face down cards in front of a player represent who they influence at
          court. The characters printed on their face down cards represents
          which characters that player influences and their abilities. Every
          time a player loses an influence they have to turn over and reveal one
          of their face down cards. Revealed cards remain face up in front of
          the player visible to everyone and no longer provide influence for the
          player. Each player always chooses which of their own cards they wish
          to reveal when they lose an influence. When a player has lost all
          their influence they are exiled and out of the game.
        </p>
        <h2>Gameplay</h2>
        <p>
          The game is played in turns in clockwise order. Each turn a player
          chooses one action only. A player may not pass. After the action is
          chosen other players have an opportunity to challenge or counteract
          that action. If an action is not challenged or counteracted, the
          action automatically succeeds. Challenges are resolved first before
          any action or counteraction is resolved. When a player has lost all
          their influence and both their cards are face up in front of them,
          they are immediately out of the game. They leave their cards face up
          and return all their coins to the Treasury. The game ends when there
          is only one player left.
        </p>
        <h2>Actions</h2>
        <p>
          A player may choose any action they want and can afford. Some actions
          (Character Actions) require influencing characters. If they choose a
          Character Action a player must claim that the required character is
          one of their face down cards. They can be telling the truth or
          bluffing. They do not need to reveal any of their face down cards
          unless they are challenged. If they are not challenged they
          automatically succeed. If a player starts their turn with 10 (or more)
          coins they must launch a Coup that turn as their only action.
        </p>
        <h3>General Actions</h3>
        <h4>Income</h4>
        <p>Take 1 coin from the Treasury</p>
        <h4>Foreign Aid</h4>
        <p>Take 2 coins from the Treasury. (Can be blocked by the Duke)</p>
        <h4>Coup</h4>
        <p>
          Pay 7 coins to the Treasury and launch a Coup against another player.
          That player immediately loses an influence. A Coup is always
          successful. If you start your turn with 10 (or more) coins you are
          required to launch a Coup.
        </p>
        <h3>Character Actions</h3>
        <h4>Duke</h4>
        <p>Take 3 coins from the Treasury.</p>
        <h4>Assassin – Assassinate</h4>
        <p>
          Pay 3 coins to the Treasury and launch an assassination against
          another player. If successful that player immediately loses an
          influence. (Can be blocked by the Contessa)
        </p>
        <h4>Captain – Steal</h4>
        <p>
          Take 2 coins from another player. If they only have one coin, take
          only one. (Can be blocked by the Ambassador or the Captain)
        </p>
        <h4>Ambassador – Exchange</h4>
        <p>
          Exchange cards with the Court. First take 2 random cards from the
          Court deck. Choose which, if any, to exchange with your face down
          cards. Then return two cards to the Court deck.
        </p>

        <h3>Counteractions</h3>
        <p>
          Counteractions can be taken by other players to intervene or block a
          player’s action. Counteractions operate like character actions.
          Players may claim to influence any of the characters and use their
          abilities to counteract another player. They may be telling the truth
          or bluffing. They do not need to show any cards unless challenged.
          Counteractions may be challenged, but if not challenged they
          automatically succeed. If an action is successfully counteracted, the
          action fails but any coins paid as the cost of the action remain
          spent.{" "}
        </p>
        <h4>Duke – Blocks Foreign Aid</h4>
        <p>
          Any player claiming the Duke may counteract and block a player
          attempting to collect foreign aid. The player trying to gain foreign
          aid receives no coins that turn.
        </p>
        <h4>Contessa – Blocks Assassination</h4>
        <p>
          The player who is being assassinated may claim the Contessa and
          counteract to block the assassination. The assassination fails but the
          fee paid by the player for the assassin remains spent.
        </p>
        <h4>Ambassador/Captain – Blocks Stealing</h4>
        <p>
          The player who is being stolen from may claim either the Ambassador or
          the Captain and counteract to block the steal. The player trying to
          steal receives no coins that turn.
        </p>
        <h2>Challenges</h2>
        <p>
          Any action or counteraction using character influence can be
          challenged. Any other player can issue a challenge to a player
          regardless of whether they are the involved in the action. Once an
          action or counteraction is declared other players must be given an
          opportunity to challenge. Once play continues challenges cannot be
          retro-actively issued. If a player is challenged they must prove they
          had the required influence by showing the relevant character is one of
          their face down cards. If they can’t, or do not wish to, prove it,
          they lose the challenge. If they can, the challenger loses. Whoever
          loses the challenge immediately loses an influence. If a player wins a
          challenge by showing the relevant character card, they first return
          that card to the Court deck, re-shuffle the Court deck and take a
          random replacement card. (That way they have not lost an influence and
          other players do not know the new influence card they have). Then the
          action or counteraction is resolved. If an action is successfully
          challenged the entire action fails, and any coins paid as the cost of
          the action are returned to the player.
        </p>
      </div>
    </div>
  );
};

export default Rules;
