import { SafeAreaView, Text, StyleSheet, Button, View, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

import { DatabaseConnection } from '../Config/db';
const db = new DatabaseConnection.getConnection;

export default function Cadastrar() {
    const navegation = useNavigation();
    const [nome, setNome] = useState(null);
    const [registros, setRegistros] = useState([]);
    const [id, setId] = useState(null);
    const [operacao, setOperacao] = useState('Incluir');
    const [genero, setGenero] = useState(null);
    const [classificacao, setClassificacao] = useState(null);

    // const options = [
    //     'one', 'two', 'three'
    // ];
    // const defaultOption = options[0];

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS filmes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_filme TEXT NOT NULL, genero TEXT NOT NULL, classificacao TEXT NOT NULL, data_cad TEXT);',
                [],
                () => console.log('Tabela filmes renderizada!'),
                (er, error) => console.error(er, error),
            );
        });
    }, [registros]);

    const adicionaFilme = () => {
        if (nome === null || nome.trim() === '') {
            Alert.alert('Erro', 'insira um valor válido para o nome!');
            return;
        }
        if (operacao === 'Incluir') {
            const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            db.transaction(tx => {
                tx.executeSql('INSERT INTO filmes (nome_filme, genero, classificacao,data_cad ) VALUES (?,?,?,?);',
                    [nome, genero, classificacao, dataAtual],
                    (_,) => {
                        Alert.alert('Info', 'Registro inserido com sucesso!')
                        setNome('');
                        setGenero('');
                        setClassificacao('');
                        atualizaLista();
                    },
                    (_, error) => {
                        console.error('Erro ao adicionar o filme', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao adicionar o filme');
                    }
                )
            })
        } else if (operacao === 'Editar') {
            db.transaction(tx => {
                tx.executeSql('UPDATE filmes SET nome_filme=? , classificacao=?, genero=? WHERE id=?;',
                    [nome, classificacao, genero, id],
                    (_, rowsAffected) => {
                        Alert.alert('Info', 'Registro alterado com sucesso!')
                        setNome('');
                        setGenero('');
                        setClassificacao('');
                        atualizaLista();
                        setOperacao('Incluir')
                    },
                    (_, error) => {
                        console.error('Erro ao alterar o Filme', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao alterar o Filme');
                    }
                )
            })
        }

    }

    const deletarFilme = (id) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM filmes WHERE id=?;',
                [id],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        atualizaLista();
                        Alert.alert('Info', 'Registro deletado com sucesso!')
                    } else {
                        Alert.alert('Erro', 'Registro não excluido, verifique e tente novamente!')
                    }
                },
                (_, error) => {
                    console.error('Erro ao excluir o registro', error);
                }
            )
        })
    }

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
    useEffect(() => {
        atualizaLista();
    }, [])

    const buttonPress = (nome) => {
        setNome(nome);
    }


    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.container}>
                <Text style={styles.title}>Cadastro de Filmes</Text>
                <TextInput style={styles.inputText}
                    value={nome}
                    onChangeText={setNome}
                    placeholder='Digite um Filme:'
                />
                {/* <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" /> */}
                <TextInput style={styles.inputText}
                    value={genero}
                    onChangeText={setGenero}
                    placeholder='Digite um Genero:'
                />
                <TextInput style={styles.inputText}
                    value={classificacao}
                    onChangeText={setClassificacao}
                    placeholder='Digite a classificação etaria:'
                />

                <Button color={'#591DA9'} title={operacao === 'Incluir' ? 'Salvar Filme' : 'Salvar edição'} onPress={adicionaFilme} />

                <Text style={styles.cardTitle}>Catalogo de Filmes</Text>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.containerScroll}>
                        {
                            registros.map(item => (
                                <View key={item.id} style={styles.input}>
                                    <Text>{item.id}</Text>
                                    <Text>{item.nome_filme}</Text>
                                    <Text>{item.genero}</Text>
                                    <Text>{item.classificacao}</Text>
                                    <Text>{item.data_cad}</Text>
                                    <View style={styles.alignLeft}>
                                        <TouchableOpacity title='delet' onPress={() => {
                                            Alert.alert(
                                                "Atenção!",
                                                'Deseja excluir o registro selecionado?',
                                                [
                                                    {
                                                        text: 'OK',
                                                        onPress: () => deletarFilme(item.id)
                                                    },
                                                    {
                                                        text: 'Cancelar',
                                                        onPress: () => { return }
                                                    }
                                                ],
                                            )
                                        }} >
                                            <FontAwesome6 name='trash-can' color='red' size={20}></FontAwesome6>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            buttonPress(item.nome), setId(item.id), setOperacao('Editar')
                                        }}>
                                            <FontAwesome6 name='pen-to-square' color='#591DA9' size={20}></FontAwesome6>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
            </View>
            <TouchableOpacity title='VoltarHome' onPress={() => navegation.navigate('Home')}>
                <FontAwesome6 name='house-user' color='#591DA9' size={40}></FontAwesome6>
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
        width: 300,
        height: '40%',
        borderWidth: 2,
        justifyContent: 'center',
        margin: 5
    },
    containerScroll: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 20,
        padding: 20,
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