import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation, StackActions } from '@react-navigation/native'

export default function Home() {
    const navegation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Text>Bem-Vindo(a)</Text>
            <TouchableOpacity>
                <FontAwesome5 name='folder-plus' color='white' size={32} onPress={()=> navegation.navigate('Cadastro')}></FontAwesome5>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonTouchable}  >
                <FontAwesome5 name='list-ul' color='white' size={32} onPress={() => navegation.navigate('Lista')}></FontAwesome5>
            </TouchableOpacity>
           <TouchableOpacity>
            <FontAwesome5 name='search' color='white' size={32} onPress={()=> navegation.navigate('Pesquisa')}></FontAwesome5>
           </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
});