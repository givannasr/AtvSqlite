import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { DatabaseConnection } from '../Config/db';
const db = new DatabaseConnection.getConnection;

export default function Pesquisa() {
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
            <Text>Informe o nome do Filme e clique em Pesquisar</Text>
            <TextInput
                ref={inputNome}
                onChangeText={setNomePesq}
                placeholder='Nome do Filme'
                style={styles.inputText}
            />
            <TouchableOpacity
                onPress={() => getFilme()}
                style={[styles.alignVH, { width: '80%', height: 40, borderColor: 'black', backgroundColor: 'blue', borderRadius: 4 }]}>
                <Text style={{ color: 'white' }}>Pressione para Pesquisar</Text>
            </TouchableOpacity>
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
            <Button title='Voltar para Home' onPress={() => navigation.navigate('Home')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        width: '80%',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
});
