import React, {Component} from 'react';
import './App.css'


import Navbar from './Navbar'
import Web3 from 'web3'


class App extends Component{
    //React Codes
    async UNSAFE_componentWillMount(){
        await this.loadWeb3()
    }

    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }else{
            window.alert('No ethereum browser detected! Consider trying Metamask out')
        }
    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x0'
        }
    }

    render(){
        return(
            <div>
                <Navbar account = {this.state.account}/>
                <div class="text-center">
                    Hello world!
                </div>
            </div>

        )
    }
}

export default App;