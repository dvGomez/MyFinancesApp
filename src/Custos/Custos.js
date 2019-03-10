/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

export default class Custos extends Component {

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

  render() {
    return (
      <View style={styles.gastosBox}>
          <Text style={{color: "#ecf0f1"}}>Gastos:</Text>
          <Text style={styles.txtGastos}>R$ {this._formatMoney(this.props.valorTotal)}</Text>
          <Text style={{color: "#ecf0f1"}}>desde {this.props.opened}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gastosBox: {
    padding:16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#2ecc71",
    borderBottomLeftRadius:28,
    borderBottomRightRadius:28,
    elevation: 4
  },
  txtGastos: {
    color:"#ecf0f1",
    fontWeight: "bold",
    fontSize: 32
  }
});
