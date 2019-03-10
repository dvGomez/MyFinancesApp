/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { AsyncStorage, Alert, StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Custos from './src/Custos/Custos';
import ListaDeItens from './src/ListaDeItens/ListaDeItens';


export default class App extends Component {

  constructor() {
    super()

    var d = new Date();

    // await AsyncStorage.clear();

    this.state = {
      nome: "Lucas",
      valorTotal: 0.0,
      paymentModal: false,
      currentPayment: {},
      novoItem: {
        nome: "",
        valor: "",
        method: 0
      },
      fechamentos: [
        {
          key: "0",
          open: d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
          itens: []
        }
      ]
    };

    this.paymentMethods = [
      {
        Id: 0,
        Name: "Dinheiro",
        Image: require('./src/Imgs/money.png')
      },
      {
        Id: 1,
        Name: "Crédito",
        Image: require('./src/Imgs/credit.png')
      },
      {
        Id: 2,
        Name: "Débito",
        Image: require('./src/Imgs/debit.png')
      }
    ];

    this.state.currentPayment = this.paymentMethods[0];
    this._retrieveData();

    // this._clearItens();

  }

  _getNewItemId() {
    var id = this.state.fechamentos[0].itens.length;
    if (id == 0) id = 1;
    else {
      id = this.state.fechamentos[0].itens[id - 1].id + 1;
    }
    return id;
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('financeData', JSON.stringify(this.state));
    } catch (error) {
      // Error saving data
    }
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('financeData');
      if (value !== null) {
        console.log(value);
        var state = JSON.parse(value);
        this.setState(state);
        this._updateTotalValue();
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _Alert(title, message) {
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  _onPressAddButton() {
    let items = this.state.fechamentos[0].itens;
    var d = new Date();

    if (!this.state.novoItem.valor || !this.state.novoItem.nome) {
      this._Alert('Falha', 'Informe o produto e um valor.');
      return;
    }

    let novoItem = {
      id: this._getNewItemId(),
      nome: this.state.novoItem.nome,
      valor: this.state.novoItem.valor,
      data: d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear(),
      method: this.state.novoItem.method
    }
    items.push(novoItem);

    this._updateNovoItemNome('');
    this._updateNovoItemValor('');

    this._updateTotalValue();
    console.log(this.state);

  }

  _clearItens() {
    var itens = this.state.fechamentos[0].itens;
    itens.splice(0, itens.length);
    this.setState({ itens });
    this._storeData();
  }

  _updateNovoItemNome(text) {
    var item = this.state.novoItem;
    item.nome = text;
    this.setState({ item });
  }

  _updateNovoItemValor(text) {
    var item = this.state.novoItem;
    item.valor = text;
    this.setState({ item });
  }

  _updateTotalValue() {

    var valorTotal = 0;

    for (let i = 0; i < this.state.fechamentos[0].itens.length; i++) {
      const g = this.state.fechamentos[0].itens[i];
      valorTotal += parseFloat(g.valor);
    }

    this.setState({ valorTotal });

    console.log(valorTotal);

    this._storeData();

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
  // document.getElementById("b").addEventListener("click", event => {
  // document.getElementById("x").innerText = "Result was: " + formatMoney(document.getElementById("d").value);

  _onPressDeleteButton(item) {
    console.log(item.nome);
    var itens = this.state.fechamentos[0].itens;
    console.log(itens.length);
    for (let i = 0; i < itens.length; i++) {
      const e = itens[i];
      if (e.id == item.id) {
        console.log("Deleted Item: " + item.name);
        delete itens.splice(i, 1);
      }
    }
    this.setState({ itens });
    this._updateTotalValue();
  }

  _actionPaymentModal() {
    var paymentModal = !this.state.paymentModal;
    this.setState({ paymentModal });
  }

  _selectPaymentMethod(currentPayment) {
    this.setState({ currentPayment });

    var novoItem = this.state.novoItem;
    novoItem.method = currentPayment.Id;
    this.setState({ novoItem });
  }

  _getPaymentType(item) {
    var paymentMethods = this.paymentMethods;
    if(item.method == undefined) return paymentMethods[0];
    console.log("Procurando método de pagamento para o item", item);
    console.log(this.paymentMethods.length);
    for (let i = 0; i < paymentMethods.length; i++) {
      console.log("Metodo de pagamento", paymentMethods[i]);
      if(item.method == paymentMethods[i].Id){
        console.log("Metodo encontrado", paymentMethods[i]);
        return paymentMethods[i];
      }
    }
    return paymentMethods[0];
  }

  render() {
    return (
      <View style={styles.container}>
        <Custos valorTotal={this.state.valorTotal} opened={this.state.fechamentos[0].open} />
        {
          this.state.fechamentos[0].itens.length == 0 ?
            <View style={styles.noContent}>
              <Text style={styles.txtNoContent}>Parece que você ainda não tem nenhum gasto.</Text>
              <Text style={styles.txtNoContent}>Para adicionar, basta preencher as informações abaixo.</Text>
            </View>
            :
            <ListaDeItens
              itens={this.state.fechamentos[0].itens}
              onPressDeleteButton={this._onPressDeleteButton.bind(this)}
              getItemPaymentType={this._getPaymentType.bind(this)} />

        }
        {this.state.paymentModal ?
          <View style={styles.viewSelectType} >
            <Text style={styles.txtTitle}>Método de Pagamento</Text>
            {
              this.paymentMethods.map(option => (
                <TouchableOpacity onPress={() => { this._selectPaymentMethod(option), this._actionPaymentModal() }}>

                  <View style={styles.viewItemSelectType}>
                    <Image style={styles.imgTypePayment}
                      source={option.Image}
                      resizeMode="center" />
                    <Text>{option.Name}</Text>
                  </View>

                </TouchableOpacity>
              ))
            }
            {/* <TouchableOpacity onPress={() => { }}>

              <View style={styles.viewItemSelectType}>
                <Image style={styles.imgTypePayment}
                  source={require('./src/Imgs/card.png')}
                  resizeMode="center" />
                <Text>Cartão de Crédito</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>

              <View style={styles.viewItemSelectType}>
                <Image style={styles.imgTypePayment}
                  source={require('./src/Imgs/card.png')}
                  resizeMode="center" />
                <Text>Cartão de Débito</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>

              <View style={styles.viewItemSelectType}>
                <Image style={styles.imgTypePayment}
                  source={require('./src/Imgs/money.png')}
                  resizeMode="center" />
                <Text>Dinheiro</Text>
              </View>

            </TouchableOpacity> */}
          </View>

          : null}


        <View style={styles.boxInsert}>

          <TouchableWithoutFeedback onPress={() => this._actionPaymentModal()}>

            <Image style={styles.imgTypePayment}
              source={this.state.currentPayment.Image}
              resizeMode="center" />

          </TouchableWithoutFeedback>

          <TextInput onChangeText={(text) => this._updateNovoItemNome(text)} style={[styles.textInput, styles.textInputItem]}
            placeholder="Item" value={this.state.novoItem.nome} />
          <TextInput onChangeText={(text) => this._updateNovoItemValor(text)} style={styles.textInput} keyboardType="number-pad"
            placeholder="R$" value={this.state.novoItem.valor} />
          <TouchableOpacity style={styles.buttonAdd} onPress={() => this._onPressAddButton()}>
            <Icon name="check" size={30} color="#3498db" />
          </TouchableOpacity>
        </View>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFF',
  },
  boxInsert: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    margin: 8,
    borderColor: "#dfe6e9"
  },
  textInputItem: {
    flex: 2
  },
  buttonAdd: {
    marginLeft: 7,
    borderWidth: 1,
    borderColor: "#dfe6e9",
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  noContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  txtNoContent: {
    fontSize: 16,
    textAlign: "center",
    paddingTop: 16
  },
  imgTypePayment: {
    width: 40,
    height: 40,
    marginRight: 8
  },
  viewSelectType: {
    width: "100%",
    position: "absolute",
    padding: 8,
    backgroundColor: "#FAFAFA",
    bottom: 0,
    zIndex: 1,
    borderWidth: 2,
    borderColor: "#ecf0f1"
  },
  viewItemSelectType: {
    flexDirection: 'row',
    alignItems: "center",
    marginBottom: 16
  },
  txtSelectType: {
    color: "#000",
    fontSize: 16
  },
  txtTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16
  }
});
