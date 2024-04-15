import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native'

export default function Home() {
    const navegation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Bem-Vindo(a)</Text>
            <Text>Cadastrar um novo Celular:</Text>
            <TouchableOpacity>
                <FontAwesome5 name='folder-plus' color='#591DA9' size={70} onPress={()=> navegation.navigate('Cadastrar')}></FontAwesome5>
            </TouchableOpacity>
            <Text>Celulares cadastrados:</Text>
            <TouchableOpacity style={styles.buttonTouchable}  >
                <FontAwesome5 name='phone' color='#591DA9' size={70} onPress={() => navegation.navigate('Lista')}></FontAwesome5>
            </TouchableOpacity>
            <Text>Pesquisar sobre um celular:</Text>
           <TouchableOpacity>
            <FontAwesome5 name='search' color='#591DA9' size={70} onPress={()=> navegation.navigate('Pesquisar')}></FontAwesome5>
           </TouchableOpacity>
           <Text>Editar ou excluir um celular:</Text>
           <TouchableOpacity>
            <FontAwesome5 name='pen-to-square' color='#591DA9' size={70} onPress={()=> navegation.navigate('EditarouExcluir')}></FontAwesome5>
           </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CB98ED',
        alignItems: 'center',
        justifyContent: 'center',
        gap:5
    },
    text:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom:80
    }
});