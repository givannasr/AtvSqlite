import {
    Button, StyleSheet, Text, View, TextInput, Alert, SafeAreaView,
    Platform, ScrollView, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../Config/db';
import { useState, useEffect } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const db = new DatabaseConnection.getConnection;

export default function Lista() {
    const navegation = useNavigation();
    const [registros, setRegistros] = useState([]);
    const atualizaLista = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM filmes;',
                [],
                (_, { rows }) => {
                    setRegistros(rows._array)
                }
            )
        })
    }

    const deletaDatabase = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
                [],
                (_, { rows }) => {
                    rows._array.forEach(table => {
                        tx.executeSql(
                            `DROP TABLE IF EXISTS ${table.name}`,
                            [],
                            () => {
                                console.log(`Tabela ${table.name} excluida com sucesso!`);
                                setRegistros([]);
                            },
                            (_, error) => {
                                console.error(`Erro ao excluir a tabela ${table.name}:`, error);
                                Alert.alert('Erro', `Ocorreu um erro ao excluir a tabela ${table.name}`);
                            }
                        )
                    })
                }
            )
        })
    }

    useEffect(() => {
        atualizaLista();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Text>Catalogo de Filmes</Text>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.containerScroll}>
                    {
                        registros.map(item => (
                            <View key={item.id} style={styles.filmeItem}>
                                <Text>{item.id}</Text>
                                <Text>{item.nome_filme}</Text>
                                <Text>{item.genero}</Text>
                                <Text>{item.classificacao}</Text>
                                <Text>{item.data_cad}</Text>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
            <TouchableOpacity title='deletaDatabase' onPress={() => {
                Alert.alert(
                    "Atenção!",
                    'Deseja excluir o banco de dados do sistema? Esta ação não podera ser desfeita!',
                    [
                        {
                            text: 'Sim',
                            onPress: () => deletaDatabase()
                        },
                        {
                            text: 'Cancelar',
                            onPress: () => { return }
                        }
                    ],
                )
            }} >
                <FontAwesome6 name='trash-can' color='black' size={50}></FontAwesome6>
            </TouchableOpacity>
            <Button title='Voltar para Home' onPress={() => navegation.navigate('Home')}></Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});