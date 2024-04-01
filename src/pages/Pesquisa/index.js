import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import { DatabaseConnection } from '../Config/db';
const db = new DatabaseConnection.getConnection;

export default function Pesquisar() {
    const navigation = useNavigation();
    const [filme, setFilme] = useState([]);
    const [nomePesq, setNomePesq] = useState('');
    const inputNome = useRef(null);

    useEffect(() => {
        if (nomePesq) {
            getFilme();
        }
    }, [nomePesq]);

    async function getFilme() {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM filmes WHERE nome=?;',
                [nomePesq],
                (_, { rows }) => {
                    setFilme(rows._array);
                },
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
                placeholder='Nome do Filme'
                style={styles.inputText}
            />
            <TouchableOpacity title='Pesquisar'
                onPress={() => getFilme()}>
                <FontAwesome6 name='magnifying-glass' color='#591DA9' size={25}></FontAwesome6>
            </TouchableOpacity>
            </View>
            {filme.length > 0 && (
                <View style={{ width: '80%' }}>
                    {filme.map((f, index) => (
                        <React.Fragment key={index}>
                            <Text>ID do filme: {f.id}</Text>
                            <Text>Nome do filme: {f.nome_filme}</Text>
                            <Text>Genero do filme: {f.genero}</Text>
                            <Text>Classificação do filme: {f.classificacao}</Text>
                            <Text>Data de cadastro do filme: {f.data_cad}</Text>
                        </React.Fragment>
                    ))}
                </View>
            )}
            <TouchableOpacity title='VoltarHome'
                style={{ marginTop: '95%' }}
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
        gap:10,
        flexDirection:'row',
        justifyContent:'flex-start',
        padding:5,
        marginRight:30
    },
});
