import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import { DatabaseConnection } from '../Config/db';
const db = new DatabaseConnection.getConnection;

export default function Pesquisar() {
    const navigation = useNavigation();
    const [input, setInput] = useState([]);
    const [nomePesq, setNomePesq] = useState('');
    const inputNome = useRef(null);

    useEffect(() => {
        if (nomePesq) {
            getCelular();
        }
    }, [nomePesq]);

    async function getCelular() {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM celulares WHERE modelo LIKE ? OR marca LIKE ?',
                [`%${input}%`, `%${input}%`],
                error => {
                    console.error(error);
                }
            );
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.alignLeft}>
                <TextInput
                    ref={inputNome}
                    onChangeText={setNomePesq}
                    placeholder='Nome do Modelo ou Marca do celular procurado:'
                    style={styles.inputText}
                />
                <TouchableOpacity title='Pesquisar'
                    onPress={() => getCelular()}>
                    <FontAwesome6 name='magnifying-glass' color='#591DA9' size={25}></FontAwesome6>
                </TouchableOpacity>
            </View>
            <View style={styles.input}>
                {celular.length > 0 && (
                    <View style={{ width: '80%' }}>
                        {celular.map((item, index) => (
                            <React.Fragment key={index}>
                                <Text>ID do celular: {item.id}</Text>
                                <Text>Modelo do celular: {item.modelo}</Text>
                                <Text>Marca do celular: {item.marca}</Text>
                                <Text>Memoria RAM do celular: {item.memoria}</Text>
                                <Text>Armazenamento do celular: {item.armazenamento}</Text>
                                <Text>Ano de Lançamento do celular:{item.ano_lancamento}</Text>
                                <Text>Data de cadastro:{item.data_cad}</Text>
                            </React.Fragment>
                        ))}
                    </View>
                )}
            </View>
            <TouchableOpacity title='VoltarHome'
                style={{ marginTop: '65%' }}
                onPress={() => navigation.navigate('Home')}>
                <FontAwesome6 name='house-user' color='#591DA9' size={40}></FontAwesome6>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CB98ED',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    alignVH: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputText: {
        color: 'black',
        borderWidth: 1,
        borderColor: 'black',
        width: '100%',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    alignLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '85%',
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 20,
        marginRight: 30,
    },
    input: {
        borderWidth: 15,
        borderColor: 'black',
        borderRadius: 5,
        padding: 15,
        width: 300,
        height: '40%',
        borderWidth: 2,
        flexGrow: 1,
        gap: 10,
        margin: 10
    },
});
