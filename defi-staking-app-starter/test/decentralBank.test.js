const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract ('DecentralBank', ([owner, customer]) => {
    let tether, rwd, decentralBank

    function convertToWei(number) {
        return web3.utils.toWei(number,'ether')
    }

    before( async() => {
        // Load Contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)
        
        // Transfer All Tokens To DecentalBank
        await rwd.transfer(decentralBank.address, convertToWei('1000000'))

        // Transfer 100 Mock Tethers To Customer 
        await tether.transfer(customer, convertToWei('100'), {from: owner})
    })

    describe('Mock Tether Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await tether.name()
            assert.equal(name, 'Fake Tether')
        })
    })

    describe('Mock Reward Token Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await rwd.name()
            assert.equal(name, 'RWD Token')
        })
    })

    describe('Decentral Bank Deployment', async () => {
        it('matches name successfully', async () => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, convertToWei('1000000'))
        })
        
        describe('Yield Farming', async () => {
            it('reward tokens for staking', async () =>{
                let result

                // Check Invester Balance
                result = await tether.balanceOf(customer)
                assert.equal(result, convertToWei('100'), 'invester balance before staking')

                // Get Approval From Customer
                await tether.approve(decentralBank.address, convertToWei('100'), {from: customer})
                await decentralBank.depositTokens(convertToWei('100'), {from: customer})

                // Check Invester Balance After Staking
                result = await tether.balanceOf(customer)
                assert.equal(result, convertToWei('0'), 'invester balance after staking')

                 // Check Decentral Bank Balance After Staking
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result, convertToWei('100'), 'decentral bank balance after staking')

                // Check Customer Staking Status After Staking
                result = await decentralBank.isStaking(customer)
                assert.equal(result, true, 'invester staking status after staking')

                // Check Issue Reward Tokens
                await decentralBank.issueTokens({from: owner})

                await decentralBank.issueTokens({from: customer}).should.be.rejected

                // Check Unstake Tokens
                await decentralBank.unstakeTokens({from: customer})

                // Check Invester Balance After UnStaking
                result = await tether.balanceOf(customer)
                assert.equal(result, convertToWei('100'), 'invester balance after unstaking')

                    // Check Decentral Bank Balance After UnStaking
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result, convertToWei('0'), 'decentral bank balance after unstaking')

                // Check Customer Staking Status After UnStaking
                result = await decentralBank.isStaking(customer)
                assert.equal(result, false, 'invester staking status after unstaking')   
            })    
        })
    })
})