const { expect } = require("chai")

describe("Token", function () {
  before(async function () {
    this.Token = await ethers.getContractFactory("Token")
    this.signers = await ethers.getSigners()
    this.alice = this.signers[0]
    this.bob = this.signers[1]
    this.carol = this.signers[2]
  })

  beforeEach(async function () {
    this.token = await this.Token.deploy()
    await this.token.deployed()
  })

  it("should have correct name and symbol and decimal", async function () {
    const name = await this.token.name()
    const symbol = await this.token.symbol()
    const decimals = await this.token.decimals()
    expect(name).to.equal("Token")
    expect(symbol).to.equal("TOKEN")
    expect(decimals).to.equal(18)
  })

  it("should only allow owner to mint token", async function () {
    await this.token.mint(this.alice.address, "100")
    await this.token.mint(this.bob.address, "1000")
    await expect(this.token.connect(this.bob).mint(this.carol.address, "1000", { from: this.bob.address })).to.be.revertedWith(
        "Ownable: caller is not the owner")
    const totalSupply = await this.token.totalSupply()
    const aliceBal = await this.token.balanceOf(this.alice.address)
    const bobBal = await this.token.balanceOf(this.bob.address)
    const carolBal = await this.token.balanceOf(this.carol.address)
    expect(totalSupply).to.equal("1100")
    expect(aliceBal).to.equal("100")
    expect(bobBal).to.equal("1000")
    expect(carolBal).to.equal("0")
  })

  it("should only allow owner to burn token", async function () {
    await this.token.mint(this.alice.address, "100")
    await this.token.mint(this.bob.address, "1000")
    await this.token.burn(this.bob.address, "100")
    await expect(this.token.connect(this.bob).burn(this.carol.address, "100", { from: this.bob.address })).to.be.revertedWith(
        "Ownable: caller is not the owner"
    )
    const totalSupply = await this.token.totalSupply()
    const aliceBal = await this.token.balanceOf(this.alice.address)
    const bobBal = await this.token.balanceOf(this.bob.address)
    const carolBal = await this.token.balanceOf(this.carol.address)
    expect(totalSupply).to.equal("1000")
    expect(aliceBal).to.equal("100")
    expect(bobBal).to.equal("900")
    expect(carolBal).to.equal("0")
  })

  it("should supply token transfers properly", async function () {
    await this.token.mint(this.alice.address, "100")
    await this.token.mint(this.bob.address, "1000")
    await this.token.transfer(this.carol.address, "10")
    await this.token.connect(this.bob).transfer(this.carol.address, "100", {
      from: this.bob.address,
    })
    const totalSupply = await this.token.totalSupply()
    const aliceBal = await this.token.balanceOf(this.alice.address)
    const bobBal = await this.token.balanceOf(this.bob.address)
    const carolBal = await this.token.balanceOf(this.carol.address)
    expect(totalSupply).to.equal("1100")
    expect(aliceBal).to.equal("90")
    expect(bobBal).to.equal("900")
    expect(carolBal).to.equal("110")
  })

  it("should fail if you try to do bad transfers", async function () {
    await this.token.mint(this.alice.address, "100")
    await expect(this.token.transfer(this.carol.address, "110")).to.be.revertedWith("revert BEP20: transfer amount exceeds balance")
    await expect(this.token.connect(this.bob).transfer(this.carol.address, "1", { from: this.bob.address })).to.be.revertedWith(
        "revert BEP20: transfer amount exceeds balance"
    )
  })

  context("when owner is changed", function () {
    beforeEach(async function () {
      await this.token.mint(this.alice.address, "100")
      await this.token.mint(this.bob.address, "1000")
      await this.token.transferOwnership(this.bob.address)
    })

    it("should only allow owner to mint token", async function () {
      await this.token.connect(this.bob).mint(this.carol.address, "1000")
      await expect(this.token.mint(this.carol.address, "1000")).to.be.revertedWith(
          "Ownable: caller is not the owner"
      )
      const totalSupply = await this.token.totalSupply()
      const aliceBal = await this.token.balanceOf(this.alice.address)
      const bobBal = await this.token.balanceOf(this.bob.address)
      const carolBal = await this.token.balanceOf(this.carol.address)
      expect(totalSupply).to.equal("2100")
      expect(aliceBal).to.equal("100")
      expect(bobBal).to.equal("1000")
      expect(carolBal).to.equal("1000")
    })

    it("should only allow owner to burn token", async function () {
      await this.token.connect(this.bob).burn(this.alice.address, "10")
      await expect(this.token.burn(this.carol.address, "1000")).to.be.revertedWith(
          "Ownable: caller is not the owner")
      const totalSupply = await this.token.totalSupply()
      const aliceBal = await this.token.balanceOf(this.alice.address)
      const bobBal = await this.token.balanceOf(this.bob.address)
      const carolBal = await this.token.balanceOf(this.carol.address)
      expect(totalSupply).to.equal("1090")
      expect(aliceBal).to.equal("90")
      expect(bobBal).to.equal("1000")
      expect(carolBal).to.equal("0")
    })
  })
})