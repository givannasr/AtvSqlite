import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Button, TextInput } from 'react-native';
import { DatabaseConnection } from '../../database/database'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

export default function EditarouExcluir() {
    const db = new DatabaseConnection.getConnection;
    const [todos, setTodos] = useState([]);
    const [id, setId] = useState('');
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [memoria, setMemoria] = useState('');
    const [armazenamento, setArmazenamento] = useState('');
    const [ano_lancamento, setAnoLancamento] = useState('');

    useEffect(() => {
        atualizaRegistros();
    }, []);


    const atualizaRegistros = () => {
        try {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM celulares',
                    [], (_, { rows }) =>
                    setTodos(rows._array),
                );
            });
        } catch (error) {
            console.error('Erro ao buscar os celulares:', error);
        }
    };




    const excluirCel = id => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM celulares WHERE id = ?',
                    [id], (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            atualizaRegistros();
                            Alert.alert('Sucesso', 'Registro excluído com sucesso.');
                        } else {
                            Alert.alert('Erro', 'Nenhum registro foi excluído, vertifique e tente novamente!');
                        }
                    },
                    (_, error) => {
                        console.error('Erro ao excluir o celular:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao excluir o celular.');
                    }
                );
            }
        );
    };

    const handleEditPress = (modelo, marca, memoria, armazenamento, ano_lancamento) => {
        setModelo(modelo);
        setMarca(marca);
        setMemoria(memoria);
        setArmazenamento(armazenamento);
        setAnoLancamento(ano_lancamento);
    };
    const salvarEdicao = () => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'UPDATE celulares SET modelo = ?, marca = ?, memoria = ?, armazenamento = ?, ano_lancamento = ? WHERE id = ?',
                    [modelo, marca, memoria, armazenamento, ano_lancamento, id],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            atualizaRegistros();
                            Alert.alert('Sucesso', 'Celular editado com sucesso');
                        } else {
                            Alert.alert('Erro', 'O celular que está sendo editado não foi encontrado');
                        }
                    },
                    (_, error) => {
                        console.error('Erro ao editar o celular:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao editar o celular');
                    }
                );
            }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.containerScroll}>
                    {todos.map(celular => (
                        <View key={celular.id} style={styles.celulartem}>
                            , , , ,
                            <Text style={styles.celItemText}>ID: {celular.id}</Text>
                            <Text style={styles.celItemText}>Modelo: {celular.modelo}</Text>
                            <Text style={styles.celItemText}>Marca: {celular.marca}</Text>
                            <Text style={styles.celItemText}>Memoria: {celular.memoria}</Text>
                            <Text style={styles.celItemText}>Armazenamento: {celular.armazenamento}</Text>
                            <Text style={styles.celItemText}>Ano de Lançamento: {celular.ano_lancamento}</Text>
                            <Text style={styles.celItemText}>Data de cadastro: {celular.data_cad}</Text>
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        "Atenção!",
                                        'Deseja excluir o registro selecionado?',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => excluirCel(celular.id)
                                            },
                                            {
                                                text: 'Cancelar',
                                                onPress: () => { return },
                                                style: 'cancel',
                                            }
                                        ],
                                    )
                                }}>
                                    <FontAwesome6 name='trash-can' color={'red'} size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleEditPress(celular.modelo, celular.marca, celular.memoria, celular.armazenamento, celular.ano_lancamento)}>
                                    <FontAwesome6 name='pen-to-square' color={'green'} size={24} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
                <View style={styles.container}>
                    <View style={styles.containerScroll}>
                        <Text>Editando informeções sobre o Celular</Text>
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

                        <View style={styles.saveButton}>
                            <Button title="Salvar" onPress={() => {
                                salvarEdicao()
                            }} />
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>


            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    containerScroll: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    celItem: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    celItemText: {
        color: '#fff', // Cor do texto
        fontSize: 18,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#333',
        color: '#fff',
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '50%',
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    inputText: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 5,
        width: 300,
        height: '5%'
    },
});