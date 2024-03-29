import { SafeAreaView, Text, StyleSheet, Button, View, TextInput, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

import { DatabaseConnection } from '../Config/db';

const db = new DatabaseConnection.getConnection;

export default function Cadastro() {
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
                tx.executeSql('UPDATE filmes SET nome = ? WHERE id=?;',
                    [nome, id],
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
            tx.executeSql('DELETE FROM clientes WHERE id=?;',
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
            <Text>Cadastro de Filmes</Text>
            <View style={styles.container}>
                <Text style={styles.title}>Cadastro</Text>
                <TextInput style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder='Digite um Filme:'
                />
                {/* <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" /> */}
                <TextInput style={styles.input}
                    value={genero}
                    onChangeText={setGenero}
                    placeholder='Digite um Genero:'
                />
                <TextInput style={styles.input}
                    value={classificacao}
                    onChangeText={setClassificacao}
                    placeholder='Digite uma classificação:'
                />

                <Button color={'#316064'} title={operacao === 'Incluir' ? 'Salvar Filme' : 'Salvar edição'} onPress={adicionaFilme} />

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
                                    <View style={styles.buttonTable}>
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
                                            <FontAwesome6 name='trash-can' color='black' size={20}></FontAwesome6>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            buttonPress(item.nome), setId(item.id), setOperacao('Editar')
                                        }}>
                                            <FontAwesome6 name='pen-to-square' color='gray' size={20}></FontAwesome6>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>



            </View>
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