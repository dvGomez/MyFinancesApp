import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ListaDeItens extends Component {

    constructor() {
        super()

        this.state = {
            editEnable: false
        }

    }

    _formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    };

    _onPressEditButton(){
        var editEnable = !this.state.editEnable;
        this.setState({editEnable});
        console.log(this.state.itens);
    }

    _verifyItens() {
        if(this.props.itens.length == 0){
            var editEnable = false;
            this.setState({editEnable});
        }
    }

    render() {
        return (
            <View style={styles.viewItens}>
                {this.props.itens.length > 0 ?
                <TouchableOpacity style={styles.buttonEdit} onPress={() => this._onPressEditButton()}>
                    <Text style={styles.txtBtnEdit}>
                    
                    {this.state.editEnable ? 'Parar Edição' : 'Editar'}
                    
                    </Text>
                </TouchableOpacity>
                : null}

                <FlatList
                    data={this.props.itens.slice().reverse()}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.props}
                    renderItem={({ item }) =>
                        <View style={styles.item}>
                            <View style={styles.viewInside}>
                                <Text style={styles.txtNome}>{item.nome}</Text>
                                <Text style={styles.txtData}>{item.data} - {this.props.getItemPaymentType(item).Name}</Text>
                                {/* <Text style={styles.txtData}>{this.props.getItemPaymentType(item).Name}</Text> */}
                            </View>
                            <Text style={styles.txtValor}>- R$ {this._formatMoney(item.valor)}</Text>
                            {this.state.editEnable ?
                                <TouchableOpacity style={styles.buttonRemove} onPress={() => {this.props.onPressDeleteButton(item); this._verifyItens()}}>
                                    <Text style={styles.txtBtnRemove}>Remover</Text>
                                </TouchableOpacity> : null
                            }
                        </View>
                    }
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewItens: {
        flex: 1
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        flexDirection: "row"
    },
    viewInside: {
        flex: 1
    },
    txtData: {
        color: "#b2bec3"
    },
    txtNome: {
        fontSize: 22,
        color: "#2d3436"
    },
    txtValor: {
        textAlign: "right",
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: "#e74c3c"
    },
    buttonRemove: {
        padding: 6,
        borderWidth: 1,
        borderColor: "#e74c3c",
        borderRadius: 26,
        marginLeft: 16
    },
    txtBtnRemove: {
        color: "#e74c3c",
        fontFamily: "Arial"
    },
    txtBtnEdit: {
        color: "black",
        fontFamily: "Arial"
    },
    buttonEdit:{
        padding:6,
        alignContent:"center",
        alignItems:"center"
    }
});