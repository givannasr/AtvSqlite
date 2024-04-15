import {
    StyleSheet, Text, View, Alert, SafeAreaView,
    ScrollView, TouchableOpacity
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
            tx.executeSql('SELECT * FROM celulares;',
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
            <Text style={styles.title}>Celulares cadastrados:</Text>
            <ScrollView style={styles.input}>
                <View>
                    {
                        registros.map(item => (
                            <View key={item.id} style={styles.filmeItem}>
                                <Text>{item.id}</Text>
                                <Text>{item.modelo}</Text>
                                <Text>{item.marca}</Text>
                                <Text>{item.memoria}</Text>
                                <Text>{item.armazenamento}</Text>
                                <Text>{item.ano_lancamento}</Text>
                                <Text>{item.data_cad}</Text>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
            <View style={styles.alignLeft}>
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
                    <FontAwesome6 name='trash-can' color='red' size={40}></FontAwesome6>
                </TouchableOpacity>
                <TouchableOpacity title='VoltarHome' onPress={() => navegation.navigate('Home')}>
                    <FontAwesome6 name='house-user' color='#591DA9' size={40}></FontAwesome6>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CB98ED',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,

    },
    cardTitle: {
        paddingBottom: 30,
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
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
    filmeItem: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 15,
        gap: 5,
        marginTop: 10
    },
    alignLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        alignSelf: 'auto',
        paddingLeft: '30%',
        gap: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
});