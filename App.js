import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function generateDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealCard(deck) {
  const card = deck.pop();
  return card;
}

function calculateHandValue(hand) {
  let value = 0;
  let numAces = 0;
  hand.forEach(card => {
    if (card.value === 'Ace') {
      numAces += 1;
      value += 11;
    } else if (['Jack', 'Queen', 'King'].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  });
  while (value > 21 && numAces > 0) {
    value -= 10;
    numAces -= 1;
  }
  return value;
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Blackjack</Text>
      <Button title="Start Game" onPress={() => navigation.navigate('Game')} />
    </View>
  );
}

function GameScreen({ navigation }) {
  const [deck, setDeck] = useState(shuffleDeck(generateDeck()));
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerStand, setPlayerStand] = useState(false);

  useEffect(() => {
    if (playerStand) {
      handleDealerPlay();
    }
  }, [playerStand]);

  function startGame() {
    let newDeck = shuffleDeck(generateDeck());
    let newPlayerHand = [dealCard(newDeck), dealCard(newDeck)];
    let newDealerHand = [dealCard(newDeck), dealCard(newDeck)];

    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setPlayerStand(false);
  }

  function hitPlayer() {
    const newCard = dealCard(deck);
    setPlayerHand([...playerHand, newCard]);
    setDeck([...deck]);
  }

  function handleStand() {
    setPlayerStand(true);
  }

  function handleDealerPlay() {
    let newDealerHand = [...dealerHand];
    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(dealCard(deck));
    }
    setDealerHand(newDealerHand);
    setDeck([...deck]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blackjack Game</Text>
      <Button title="Deal" onPress={startGame} />
      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Player's Hand:</Text>
        {playerHand.map((card, index) => (
          <Text key={index}>{card.value} of {card.suit}</Text>
        ))}
        <Text>Player's Hand Value: {calculateHandValue(playerHand)}</Text>
      </View>
      <View style={styles.handContainer}>
        <Text style={styles.handTitle}>Dealer's Hand:</Text>
        {dealerHand.map((card, index) => (
          <Text key={index}>{card.value} of {card.suit}</Text>
        ))}
        <Text>Dealer's Hand Value: {calculateHandValue(dealerHand)}</Text>
      </View>
      {!playerStand && (
        <View style={styles.actions}>
          <Button title="Hit" onPress={hitPlayer} />
          <Button title="Stand" onPress={handleStand} />
        </View>
      )}
      {playerStand && (
        <Text>Game Over. Dealer's final hand value: {calculateHandValue(dealerHand)}</Text>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  handContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  handTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});
