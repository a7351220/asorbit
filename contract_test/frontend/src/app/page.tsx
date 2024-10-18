'use client'

import type { FormEvent } from 'react'
import { type Hex, formatEther, parseAbi, parseEther, BaseError } from 'viem'
import {
  useAccount,
  useAccountEffect,
  useBalance,
  useBlockNumber,
  useChainId,
  useConfig,
  useConnect,
  useConnections,
  useConnectorClient,
  useDisconnect,
  useEnsName,
  useReadContract,
  useReadContracts,
  useSendTransaction,
  useSignMessage,
  useSwitchAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  useEstimateGas
} from 'wagmi'
import { switchChain } from 'wagmi/actions'
import { baseSepolia } from 'wagmi/chains'

import { wagmiContractConfig, nftLotteryContractConfig } from './contracts'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

// 添加 truncateAddress 函數
function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// 添加這個新函數來生成 Base Sepolia 區塊鏈瀏覽器的交易 URL
function getBaseSepioliaExplorerUrl(txHash: string): string {
  return `https://sepolia.basescan.org/tx/${txHash}`;
}

export default function NFTApp() {
  useAccountEffect({
    onConnect(_data) {
      // console.log('onConnect', data)
    },
    onDisconnect() {
      // console.log('onDisconnect')
    },
  })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>NFT Lottery App</h1>
      <div className={styles.grid}>
        <Account />
        <Connect />
        <SwitchAccount />
        <SwitchChain />
        <NFTInfo />
        <MintNFT />
        <ParticipantInfo />
        <AllParticipants />
        <NFTLottery />
        <Balance />
        <BlockNumber />
        <ConnectorClient />
        <ListedNFTs />
        <OwnedNFTs />
      </div>
    </div>
  )
}

function Account() {
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({
    address: account.address,
  })

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Account</h2>
      <div>
        account: <span className={styles.truncatedAddress}>{account.address ? truncateAddress(account.address) : ''}</span> {ensName && <span>({ensName})</span>}
        <br />
        chainId: {account.chainId}
        <br />
        status: {account.status}
      </div>
      {account.status !== 'disconnected' && (
        <button type="button" onClick={() => disconnect()} className={styles.button}>
          Disconnect
        </button>
      )}
    </div>
  )
}

function Connect() {
  const chainId = useChainId()
  const { connectors, connect, status, error } = useConnect()

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Connect</h2>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector, chainId })}
          type="button"
          className={styles.button}
        >
          {connector.name}
        </button>
      ))}
      <div>{status}</div>
      <div>{error?.message}</div>
    </div>
  )
}

function SwitchAccount() {
  const account = useAccount()
  const { connectors, switchAccount } = useSwitchAccount()

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Switch Account</h2>
      {connectors.map((connector) => (
        <button
          disabled={account.connector?.uid === connector.uid}
          key={connector.uid}
          onClick={() => switchAccount({ connector })}
          type="button"
          className={styles.button}
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
}

function SwitchChain() {
  const chainId = useChainId()
  const { chains, switchChain, error } = useSwitchChain()

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Switch Chain</h2>
      {chains.map((chain) => (
        <button
          disabled={chainId === chain.id}
          key={chain.id}
          onClick={() => switchChain({ chainId: chain.id })}
          type="button"
          className={styles.button}
        >
          {chain.name}
        </button>
      ))}
      <button
        disabled={chainId === baseSepolia.id}
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        type="button"
        className={styles.button}
      >
        Switch to Base Sepolia
      </button>
      {error?.message}
    </div>
  )
}

function NFTInfo() {
  const { data: name } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'name',
  })
  const { data: symbol } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'symbol',
  })
  const { data: totalSupply } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'totalSupply',
  })
  const { data: price } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'price',
  })
  const { data: saleEndTime } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'saleEndTime',
  })

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>NFT Information</h2>
      <p>Name: {name}</p>
      <p>Symbol: {symbol}</p>
      <p>Total Supply: {totalSupply?.toString()}</p>
      <p>Price: {price ? formatEther(price) : '0'} ETH</p>
      <p>Sale End Time: {saleEndTime ? new Date(Number(saleEndTime) * 1000).toLocaleString() : 'N/A'}</p>
    </div>
  )
}

function MintNFT() {
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { data: price } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'price',
  })

  const [listingPrice, setListingPrice] = useState<string>('')
  const [tokenIdToList, setTokenIdToList] = useState<string>('')

  const { writeContract: listNFT, error: listError } = useWriteContract()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const amount = formData.get('amount') as string
    if (!price) return
    writeContract({
      ...wagmiContractConfig,
      functionName: 'mintNFT',
      args: [BigInt(amount)],
      value: price * BigInt(amount),
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Mint NFT</h2>
      <form onSubmit={submit}>
        <input name="amount" placeholder="Amount" type="number" min="1" required className={styles.input} />
        <button disabled={isPending || !price} type="submit" className={styles.button}>
          {isPending ? 'Confirming...' : `Mint (${price ? formatEther(price) : '0'} ETH each)`}
        </button>
      </form>
      {hash && (
        <div>
          Transaction Hash:{' '}
          <a
            href={getBaseSepioliaExplorerUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.txLink}
          >
            <span className={styles.truncatedAddress}>{truncateAddress(hash)}</span>
          </a>
        </div>
      )}
      {isConfirming && 'Waiting for confirmation...'}
      {isConfirmed && 'Transaction confirmed.'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
      {listError && <div>Error: {(listError as BaseError).shortMessage || listError.message}</div>}
    </div>
  )
}

function ParticipantInfo() {
  const { address } = useAccount()
  const { data: participantInfo } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getParticipantInfo',
    args: [address as `0x${string}`],
  })

  if (!participantInfo) return null

  const [purchaseCount, tokenCount, tokenIds] = participantInfo

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Your Participant Info</h2>
      <p>Purchase Count: {purchaseCount.toString()}</p>
      <p>Token Count: {tokenCount.toString()}</p>
      <p>Token IDs: {tokenIds.join(', ')}</p>
    </div>
  )
}

function AllParticipants() {
  const { data: participants } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getAllParticipants',
  })

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>All Participants</h2>
      <ul className={styles.list}>
        {participants?.map((participant, index) => (
          <li key={index} className={styles.listItem}>
            <span className={styles.truncatedAddress}>{truncateAddress(participant)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NFTLottery() {
  const [winners, setWinners] = useState<`0x${string}`[]>([])
  const [winnerTokenIds, setWinnerTokenIds] = useState<bigint[]>([])
  const [limitedEditionTokenIds, setLimitedEditionTokenIds] = useState<bigint[]>([])
  const [participants, setParticipants] = useState<{ address: `0x${string}`; weight: bigint; startRange: bigint; endRange: bigint }[]>([])
  const [totalWeight, setTotalWeight] = useState<bigint>(BigInt(0))
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [winnerCounts, setWinnerCounts] = useState<bigint[]>([])

  const { address } = useAccount()

  const { writeContract: updateParticipants, data: updateTxHash, error: updateError } = useWriteContract()
  const { writeContract: requestRandomness, data: requestTxHash, error: requestError } = useWriteContract()
  const { writeContract: selectWinners, data: selectTxHash, error: selectError } = useWriteContract()
  const { writeContract: distributeNFTs, data: distributeTxHash, error: distributeError } = useWriteContract()
  const { writeContract: mintAndDistribute, data: mintDistributeTxHash, error: mintDistributeError } = useWriteContract()

  const { isLoading: isUpdateConfirming, isSuccess: isUpdateConfirmed } = useWaitForTransactionReceipt({ hash: updateTxHash })
  const { isLoading: isRequestConfirming, isSuccess: isRequestConfirmed } = useWaitForTransactionReceipt({ hash: requestTxHash })
  const { isLoading: isSelectConfirming, isSuccess: isSelectConfirmed } = useWaitForTransactionReceipt({ hash: selectTxHash })
  const { isLoading: isDistributeConfirming, isSuccess: isDistributeConfirmed } = useWaitForTransactionReceipt({ hash: distributeTxHash })
  const { isLoading: isMintDistributeConfirming, isSuccess: isMintDistributeConfirmed } = useWaitForTransactionReceipt({ hash: mintDistributeTxHash })

  const { data: lotteryFinished } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'lotteryFinished',
  })

  const { data: participantCount } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getParticipantCount',
  })

  const { data: totalWeightData } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getTotalWeight',
  })

  const { data: winnersData } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getWinners',
  })

  const { data: winnerTokenIdsData } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getWinnerTokenIds',
  })

  const { data: limitedEditionTokenIdsData } = useReadContract({
    ...nftLotteryContractConfig,
    functionName: 'getLimitedEditionTokenIds',
  })

  useEffect(() => {
    if (participantCount) {
      const fetchParticipants = async () => {
        const participantPromises = Array.from({ length: Number(participantCount) }, (_, i) =>
          useReadContract({
            ...nftLotteryContractConfig,
            functionName: 'getParticipant',
            args: [BigInt(i)],
          })
        )
        const participantResults = await Promise.all(participantPromises)
        const newParticipants = participantResults
          .map(result => result.data)
          .filter((data): data is readonly [`0x${string}`, bigint, bigint, bigint] => !!data)
          .map(([address, weight, startRange, endRange]) => ({
            address,
            weight,
            startRange,
            endRange
          }))
        setParticipants(newParticipants)
      }
      fetchParticipants()
    }
  }, [participantCount, refreshTrigger])

  useEffect(() => {
    if (totalWeightData) setTotalWeight(totalWeightData)
    if (winnersData && Array.isArray(winnersData) && winnersData.length === 2) {
      const [winnerAddresses, winnerCountsData] = winnersData;
      if (Array.isArray(winnerAddresses) && Array.isArray(winnerCountsData)) {
        setWinners(winnerAddresses as `0x${string}`[])
        setWinnerCounts(winnerCountsData.map(count => BigInt(count)))
      } else {
        console.error('Unexpected winners data format:', winnersData)
      }
    }
    if (winnerTokenIdsData) setWinnerTokenIds(winnerTokenIdsData as bigint[])
    if (limitedEditionTokenIdsData) setLimitedEditionTokenIds(limitedEditionTokenIdsData as bigint[])
  }, [totalWeightData, winnersData, winnerTokenIdsData, limitedEditionTokenIdsData, refreshTrigger])

  const refreshLotteryData = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleUpdateParticipants = async () => {
    try {
      await updateParticipants({
        ...nftLotteryContractConfig,
        functionName: 'updateParticipants',
      })
      refreshLotteryData()
    } catch (error) {
      console.error('Error updating participants:', error)
    }
  }

  const handleRequestRandomness = async () => {
    try {
      await requestRandomness({
        ...nftLotteryContractConfig,
        functionName: 'requestRandomness',
      })
      console.log('Randomness requested successfully')
    } catch (error) {
      if (error instanceof BaseError) {
        console.error('Contract error:', error.shortMessage || error.message)
      } else {
        console.error('Unexpected error:', error)
      }
    }
  }

  const handleSelectWinners = async () => {
    try {
      await selectWinners({
        ...nftLotteryContractConfig,
        functionName: 'selectWinners',
      });
      refreshLotteryData(); 
    } catch (error) {
      if (error instanceof BaseError) {
        console.error('Contract error:', error.shortMessage || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }

  const handleDistributeNFTs = async () => {
    try {
      await distributeNFTs({
        ...nftLotteryContractConfig,
        functionName: 'distributeNFTsToWinners',
      })
      refreshLotteryData()
    } catch (error) {
      console.error('Error distributing NFTs:', error)
    }
  }

  const handleMintAndDistribute = async () => {
    try {
      await mintAndDistribute({
        ...nftLotteryContractConfig,
        functionName: 'mintAndDistributeWinnerNFTs',
      })
      refreshLotteryData()
    } catch (error) {
      console.error('Error minting and distributing NFTs:', error)
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>NFT Lottery</h2>
      
      <div className={styles.card}>
        <h3>Update Participants</h3>
        <button onClick={handleUpdateParticipants} disabled={isUpdateConfirming || lotteryFinished} className={styles.button}>
          {isUpdateConfirming ? 'Updating...' : 'Update Participants'}
        </button>
        {updateTxHash && (
          <p>
            Transaction Hash:{' '}
            <a
              href={getBaseSepioliaExplorerUrl(updateTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              <span className={styles.truncatedAddress}>{truncateAddress(updateTxHash)}</span>
            </a>
          </p>
        )}
        {updateError && <p>Error: {updateError.message}</p>}
        {isUpdateConfirmed && <p>Update completed successfully!</p>}
        <p>Total Participants: {participants.length}</p>
        <p>Total Weight: {totalWeight.toString()}</p>
      </div>

      <div className={styles.card}>
        <h3>Request Randomness</h3>
        <button onClick={handleRequestRandomness} disabled={isRequestConfirming || lotteryFinished} className={styles.button}>
          {isRequestConfirming ? 'Requesting...' : 'Request Randomness'}
        </button>
        {requestTxHash && (
          <p>
            Transaction Hash:{' '}
            <a
              href={getBaseSepioliaExplorerUrl(requestTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              <span className={styles.truncatedAddress}>{truncateAddress(requestTxHash)}</span>
            </a>
          </p>
        )}
        {requestError && <p>Error: {requestError.message}</p>}
        {isRequestConfirmed && <p>Randomness requested successfully!</p>}
      </div>

      <div className={styles.card}>
        <h3>Select Winners</h3>
        <button onClick={handleSelectWinners} disabled={isSelectConfirming || lotteryFinished} className={styles.button}>
          {isSelectConfirming ? 'Selecting...' : 'Select Winners'}
        </button>
        {selectTxHash && (
          <p>
            Transaction Hash:{' '}
            <a
              href={getBaseSepioliaExplorerUrl(selectTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              <span className={styles.truncatedAddress}>{truncateAddress(selectTxHash)}</span>
            </a>
          </p>
        )}
        {selectError && <p>Error: {selectError.message}</p>}
        {isSelectConfirmed && <p>Winners selected successfully!</p>}
      </div>

      <div className={styles.card}>
        <h3>Distribute NFTs to Winners</h3>
        <button onClick={handleDistributeNFTs} disabled={isDistributeConfirming || !lotteryFinished} className={styles.button}>
          {isDistributeConfirming ? 'Distributing...' : 'Distribute NFTs'}
        </button>
        {distributeTxHash && (
          <p>
            Transaction Hash:{' '}
            <a
              href={getBaseSepioliaExplorerUrl(distributeTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              <span className={styles.truncatedAddress}>{truncateAddress(distributeTxHash)}</span>
            </a>
          </p>
        )}
        {distributeError && <p>Error: {distributeError.message}</p>}
        {isDistributeConfirmed && <p>NFTs distributed successfully!</p>}
      </div>

      <div className={styles.card}>
        <h3>Mint and Distribute Winner NFTs</h3>
        <button onClick={handleMintAndDistribute} disabled={isMintDistributeConfirming || !lotteryFinished} className={styles.button}>
          {isMintDistributeConfirming ? 'Minting and Distributing...' : 'Mint and Distribute NFTs'}
        </button>
        {mintDistributeTxHash && (
          <p>
            Transaction Hash:{' '}
            <a
              href={getBaseSepioliaExplorerUrl(mintDistributeTxHash)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.txLink}
            >
              <span className={styles.truncatedAddress}>{truncateAddress(mintDistributeTxHash)}</span>
            </a>
          </p>
        )}
        {mintDistributeError && <p>Error: {mintDistributeError.message}</p>}
        {isMintDistributeConfirmed && <p>Winner NFTs minted and distributed successfully!</p>}
      </div>

      <div className={styles.card}>
        <h3>Lottery Results</h3>
        {winners.length > 0 ? (
          <div>
            <h4>Winners:</h4>
            <ul className={styles.list}>
              {winners.map((winner, index) => (
                <li key={index} className={styles.listItem}>
                  <span className={styles.truncatedAddress}>{truncateAddress(winner)}</span>
                   - Won: {winnerCounts[index]?.toString() || '1'} time(s)
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No winners yet</p>
        )}
      </div>

      <div className={styles.card}>
        <h3>Participants</h3>
        <p>Total Participants: {participants.length}</p>
        <ul className={styles.list}>
          {participants.map((participant, index) => (
            <li key={index} className={styles.listItem}>
              Address: <span className={styles.truncatedAddress}>{truncateAddress(participant.address)}</span>, Weight: {participant.weight.toString()}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={refreshLotteryData} className={styles.button}>Refresh Lottery Data</button>
    </div>
  )
}

function Balance() {
  const { address } = useAccount()

  const { data: default_ } = useBalance({ address })
  const { data: account_ } = useBalance({ address })
  const { data: baseSepolia_ } = useBalance({
    address,
    chainId: baseSepolia.id,
  })

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Balance</h2>
      <div>
        Balance (Default Chain):{' '}
        {!!default_?.value && formatEther(default_.value)}
      </div>
      <div>
        Balance (Account Chain):{' '}
        {!!account_?.value && formatEther(account_.value)}
      </div>
      <div>
        Balance (Base Sepolia Chain):{' '}
        {!!baseSepolia_?.value && formatEther(baseSepolia_.value)}
      </div>
    </div>
  )
}

function BlockNumber() {
  const { data: default_ } = useBlockNumber({ watch: true })
  const { data: account_ } = useBlockNumber({
    watch: true,
  })
  const { data: baseSepolia_ } = useBlockNumber({
    chainId: baseSepolia.id,
    watch: true,
  })

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Block Number</h2>
      <div>Block Number (Default Chain): {default_?.toString()}</div>
      <div>Block Number (Account Chain): {account_?.toString()}</div>
      <div>Block Number (Base Sepolia): {baseSepolia_?.toString()}</div>
    </div>
  )
}

function ConnectorClient() {
  const { data, error } = useConnectorClient()
  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Connector Client</h2>
      client <span className={styles.truncatedAddress}>{data?.account?.address ? truncateAddress(data.account.address) : ''}</span> {data?.chain?.id}
      {error?.message}
    </div>
  )
}

// 添加新的組件來展示上架的NFT
function ListedNFTs() {
  const [listedNFTs, setListedNFTs] = useState<bigint[]>([])

  const { data: listedNFTsData } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getAllListedNFTs',
  })

  useEffect(() => {
    if (listedNFTsData) {
      setListedNFTs(listedNFTsData as bigint[])
    }
  }, [listedNFTsData])

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Listed NFTs</h2>
      <ul className={styles.list}>
        {listedNFTs.map((tokenId) => (
          <ListedNFTItem key={tokenId.toString()} tokenId={tokenId} />
        ))}
      </ul>
    </div>
  )
}

function ListedNFTItem({ tokenId }: { tokenId: bigint }) {
  const { data: listing } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getListing',
    args: [tokenId],
  })

  const { writeContract: buyNFT, error: buyError } = useWriteContract()

  const handleBuy = async () => {
    if (listing) {
      const [, price] = listing
      try {
        await buyNFT({
          ...wagmiContractConfig,
          functionName: 'buyNFT',
          args: [tokenId],
          value: price,
        })
      } catch (error) {
        console.error('Error buying NFT:', error)
      }
    }
  }

  if (!listing) return null

  const [seller, price] = listing

  return (
    <li className={styles.listItem}>
      Token ID: {tokenId.toString()} - Price: {formatEther(price)} ETH
      <button onClick={handleBuy} className={styles.button}>Buy</button>
      {buyError && <p>Error: {buyError.message}</p>}
    </li>
  )
}

// 添加新的組件來展示用戶擁有的NFT
function OwnedNFTs() {
  const [ownedNFTs, setOwnedNFTs] = useState<bigint[]>([])
  const [showListed, setShowListed] = useState(false)
  const { address } = useAccount()

  const { data: ownedNFTsData } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getOwnedNFTs',
    args: [address as `0x${string}`, !showListed],
  })

  useEffect(() => {
    if (ownedNFTsData) {
      setOwnedNFTs(ownedNFTsData as bigint[])
    }
  }, [ownedNFTsData, showListed])

  return (
    <div className={styles.card}>
      <h2 className={styles.componentTitle}>Your NFTs</h2>
      <button onClick={() => setShowListed(!showListed)} className={styles.button}>
        {showListed ? 'Hide Listed NFTs' : 'Show Listed NFTs'}
      </button>
      <ul className={styles.list}>
        {ownedNFTs.map((tokenId) => (
          <OwnedNFTItem key={tokenId.toString()} tokenId={tokenId} />
        ))}
      </ul>
    </div>
  )
}

function OwnedNFTItem({ tokenId }: { tokenId: bigint }) {
  const [listingPrice, setListingPrice] = useState('')
  const { writeContract: listNFT, error: listError } = useWriteContract()
  const { data: isListedData } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'isListed',
    args: [tokenId],
  })

  const handleList = async () => {
    if (listingPrice && !isListedData) {
      try {
        await listNFT({
          ...wagmiContractConfig,
          functionName: 'listNFT',
          args: [tokenId, parseEther(listingPrice)],
        })
      } catch (error) {
        console.error('Error listing NFT:', error)
      }
    }
  }

  const { writeContract: cancelListing, error: cancelError } = useWriteContract()

  const handleCancelListing = async () => {
    if (isListedData) {
      try {
        await cancelListing({
          ...wagmiContractConfig,
          functionName: 'cancelListing',
          args: [tokenId],
        })
      } catch (error) {
        console.error('Error cancelling listing:', error)
      }
    }
  }

  return (
    <li className={styles.listItem}>
      Token ID: {tokenId.toString()}
      {!isListedData ? (
        <>
          <input
            type="text"
            value={listingPrice}
            onChange={(e) => setListingPrice(e.target.value)}
            placeholder="Listing Price (ETH)"
            className={styles.input}
          />
          <button onClick={handleList} className={styles.button}>List for Sale</button>
          {listError && <p>Error: {listError.message}</p>}
        </>
      ) : (
        <>
          <span>Listed</span>
          <button onClick={handleCancelListing} className={styles.button}>Cancel Listing</button>
          {cancelError && <p>Error: {cancelError.message}</p>}
        </>
      )}
    </li>
  )
}