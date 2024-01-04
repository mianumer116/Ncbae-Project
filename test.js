const {expect}=require('chai');
describe("we are checking the ncbae east canal campus smart contract",async function(){
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let hardhat;
  it("check the owner after deploying it shoul be match with provided addrss in constructor",async function(){
    [owner,addr1,addr2,addr3]=await ethers.getSigners();
    let ncbae=await ethers.getContractFactory("ncbae");
    hardhat=await ncbae.deploy(owner.address);
    let owners=await hardhat.owner();
    expect(owners).to.equal(owner.address);

  })
  it("enroll function it should only call by owner",async function(){
    await expect(hardhat.connect(addr2).enroll(1,"umersohail",2)).to.be.revertedWith("only owner can call this");
  })
  it("enroll function should check the id for alredy existence ",async function(){
    await hardhat.connect(owner).enroll(1,"umersohail",1);
   await expect(hardhat.connect(owner).enroll(1,"aliahmad",2)).to.be.revertedWith("this id is alredy found");
  })
  it("it should enroll the id and stored in mapping",async function(){
    await hardhat.connect(owner).enroll(2,"talhasohail",3);
    let talha=await hardhat.students(2);
    expect(talha.id).to.equal(2);
    expect(talha.name).to.equal("talhasohail");
    expect(talha.fees).to.equal(3);
    expect(talha.totalpaidfees).to.equal(0);
  })
  it("should revert feespaid if student id not exist",async function(){
   await expect(hardhat.connect(addr3).paidfees(3)).to.be.revertedWith("id not found");
  


  })
  it("should be reverted if balance is not enough to paid fees",async function(){
    expect(hardhat.connect(addr3).paidfees(2)).to.be.revertedWith("balance is not enough to paid fees");
  })
  it("should update totalpaidfees after paid fees for student",async function(){
    await hardhat.connect(addr3).deposit({value:ethers.utils.parseEther("3")});
    await hardhat.connect(addr3).paidfees(2);
    let amount=ethers.utils.parseEther("3");
    let paid=await hardhat.students(2);
      expect(paid.totalpaidfees).to.equal("3");
  })
  it("should reverted the balance if amount of withdraw is not equal to user balane",async function(){
    let amount=ethers.utils.parseEther("5");
    await expect(hardhat.connect(addr3).withdraw(amount)).to.be.revertedWith("balance is not enough for withdraw");
    
    })
    it("should update balance after user withdraw",async function(){
      let amount=ethers.utils.parseEther("4")
      await hardhat.connect(addr1).deposit({value:amount});
      await hardhat.connect(addr1).withdraw(amount);
      let balance=await hardhat.balance(addr1.address);
      expect(balance).to.equal(0);
    })
})
