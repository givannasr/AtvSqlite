import { SafeAreaView, Text, StyleSheet, Button, View, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import { DatabaseConnection } from '../Config/db';
const db = new DatabaseConnection.getConnection;

export default function Cadastrar() {
    const navegation = useNavigation();
    const [modelo, setModelo] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [marca, setMarca] = useState(null);
    const [ano_lancamento, setAnoLancamento] = useState(null);
    const [memoria, setMemoria] = useState(null);
    const [armazenamento, setArmazenamento] = useState(null);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS celulares (id INTEGER PRIMARY KEY AUTOINCREMENT, modelo TEXT NOT NULL, marca TEXT NOT NULL, memoria TEXT NOT NULL, armazenamento TEXT NOT NULL, ano_lancamento YEAR NOT NULL,  data_cad TEXT);',
                [],
                () => console.log('Tabela celulares renderizada!'),
                (er, error) => console.error(er, error),
            );
        });
    }, [registros]);

    const adicionaCelular = () => {
        if (nome === null || nome.trim() === '') {
            Alert.alert('Erro', 'insira um valor válido para o modelo!');
            return;
        }
        const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        db.transaction(tx => {
            tx.executeSql('INSERT INTO celulares (modelo, marca, memoria, armazenamento, ano_lancamento, data_cad ) VALUES (?,?,?,?);',
                [modelo, marca, memoria, armazenamento, ano_lancamento, dataAtual],
                (_,) => {
                    Alert.alert('Info', 'Registro inserido com sucesso!')
                    setModelo('');
                    setMarca('');
                    setMemoria('');
                    setArmazenamento('');
                    setAnoLancamento('');
                    atualizaLista();
                },
                (_, error) => {
                    console.error('Erro ao adicionar o celular', error);
                    Alert.alert('Erro', 'Ocorreu um erro ao adicionar o celular');
                }
            )
        })
    }

    const atualizaLista = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM celulares;',
                [],
                (_, { rows }) => {
                    setRegistros(rows._array)
                }
            )
        })
    }
    useEffect(() => {
        atualizaLista();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Cadastro de Celular</Text>
                <TextInput style={styles.inputText}
                    value={modelo}
                    onChangeText={setModelo}
                    placeholder='Digite um modelo:'
                />
                <TextInput style={styles.inputText}
                    value={marca}
                    onChangeText={setMarca}
                    placeholder='Digite uma marca:'
                />
                <TextInput style={styles.inputText}
                    value={memoria}
                    onChangeText={setMemoria}
                    placeholder='Digite a memoria:'
                />
                <TextInput style={styles.inputText}
                    value={armazenamento}
                    onChangeText={setArmazenamento}
                    placeholder='Digite o armazenamento:'
                />
                <TextInput style={styles.inputText}
                    value={ano_lancamento}
                    onChangeText={setAnoLancamento}
                    placeholder='Digite o ano de lancamento:'
                />

                <Button color={'#591DA9'} title='Cadastrar um novo celular' onPress={adicionaCelular} />

                <Text style={styles.cardTitle}>Celulares cadastrados</Text>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.containerScroll}>
                        {
                            registros.map(item => (
                                <View key={item.id} style={styles.input}>
                                    <Text>{item.id}</Text>
                                    <Text>{item.modelo}</Text>
                                    <Text>{item.marca}</Text>
                                    <Text>{item.memoria}</Text>
                                    <Text>{item.armazenamento}</Text>
                                    <Text>{item.ano_lancamento}</Text>
                                    <Text>{item.data_cad}</Text>
                                </View>))
                        }
                    </View>
                </ScrollView>
            </View>
            <TouchableOpacity title='VoltarHome' onPress={() => navegation.navigate('Home')}>
                <FontAwesome6 name='house-user' color='#591DA9' size={40}></FontAwesome6>
            </TouchableOpacity>
        </SafeAreaView>)

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CB98ED',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 10
    },
    inputText: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
        width: 300,
        height: '5%'
    },
    cardTitle: {
        paddingTop: 30,
        alignItems: 'center'

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 15,
        width: 270,
        height: 120,
        borderWidth: 2,
        justifyContent: 'center',
        margin: 5
    },
    containerScroll: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        padding: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        gap: 10
    },
    alignLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'auto',
        paddingLeft: '70%',
        gap: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
});