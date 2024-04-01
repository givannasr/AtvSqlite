import { NavigationContainer } from '@react-navigation/native';

import Home from './src/pages/Home';
import Lista from './src/pages/Lista'
import Cadastro from './src/pages/Cadastro';
import Pesquisa from './src/pages/Pesquisa';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={Home}
        />
        <Stack.Screen
          name='Lista'
          component={Lista}
        />
        <Stack.Screen
          name='Cadastrar'
          component={Cadastro}
        />
        <Stack.Screen
          name='Pesquisar'
          component={Pesquisa}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}