import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process'; 
import { existsSync } from 'fs';

const tokens = {
  "d4cfaa66-8b9a-4fcd-9adb-5203c82df958": "https://nftmedia.parallelnft.com/parallel-alpha/QmWfHP231QbgzNagvxKD64XiTt4zVx5YM1mTRuVKVPxHGx/image.png",
  "a052271c-0149-4555-8705-28937cc3f3b9": "https://nftmedia.parallelnft.com/parallel-alpha/QmVzfyTxx7upahaug2omqNeHneng8puzJ3rvXkM9DhW12o/image.png",
  "ea45fce9-0092-4370-adba-fe808b429571": "https://nftmedia.parallelnft.com/parallel-alpha/Qmch9WYTBdMW8JkYjuWUpNNwrt9CtXsAXpWkSDqd63xYBX/image.png",
  "5c0c9726-7a15-45f3-aac9-f7347b716b5b": "https://nftmedia.parallelnft.com/parallel-alpha/QmTR52if6ewgu8SoNZ1GyWpFPnNSyYohYduhGDWCQnfDaX/image.png",
  "deebde2c-8bfe-4d68-a63a-8a947bec6f87": "https://nftmedia.parallelnft.com/parallel-alpha/QmcvjDzJh7r33VXggDRqV8Xk9LTT6TPrp6gAiiaVbaMJDK/image.png",
  "7aebfbc7-842a-4a75-b1d7-55c32670ea83": "https://nftmedia.parallelnft.com/parallel-alpha/QmPbjhqv3EkMdJ7BF8my38DheD9GgSwDJoDXiB2SBevyv8/image.png",
  "6fd93c80-0789-41ea-9010-06de847def99": "https://nftmedia.parallelnft.com/parallel-alpha/QmSUU1uRmrSg1uE8Fy2jaLutcdNJYHBao91pBfVd6RhbYS/image.png",
  "12687626-e27d-4041-b65c-cb6aee3e1fac": "https://nftmedia.parallelnft.com/parallel-alpha/QmU9YC4ZKFpMVPiyhSuWsqLcgTWzWhFMdotrDdwRLKx4jV/image.png",
  "b51c74be-c581-417b-8643-445af16e0d1b": "https://nftmedia.parallelnft.com/parallel-alpha/QmU32T5is25krkm7B2a8p9PSntV19XqW6qEo1YB64x1zh7/image.png",
  "5cfeabd8-6be8-45ed-a398-74a5d73208a6": "https://nftmedia.parallelnft.com/parallel-alpha/QmVBLzxWqBp9B7yAPr8uBxS4CQmDhfQecCpLy7zpXEQSU3/image.png",
  "dcc0335a-6235-45ef-8a55-f7a926f5d5bc": "https://nftmedia.parallelnft.com/parallel-alpha/QmWm1YxfXk9JfF1fLKJvHvNUxpE4MzTjDUiVLBaCwnwgXm/image.png",
  "ba7d7dd6-9f92-4e72-8335-71f2ce6bd089": "https://nftmedia.parallelnft.com/parallel-alpha/QmaS6txi4HVZynTtYMEeFP8rVRUqw4Q1nves3TkPN1DiqV/image.png",
  "0ad6b62a-4f2c-438c-8882-09f437904bbf": "https://nftmedia.parallelnft.com/parallel-alpha/QmYsZ3LutVKqSDqwMEDhxHVr82PYmMXRJccgGhG3qS1aud/image.png",
  "35e6b733-f977-4560-a06a-511928a3e900": "https://nftmedia.parallelnft.com/parallel-alpha/QmUXXgPmsmvBprbjvBhPtbgGQ7gd845V7vcgjcFM854i3J/image.png",
  "1e69ac2b-64cc-4c03-8d32-d934cfd9c443": "https://nftmedia.parallelnft.com/parallel-alpha/QmW6797t1Jc8DW5LFXjbrXozXJYxSYaRjEvTVkudweZw7M/image.png",
  "04776c71-8d9b-476a-a5c9-c4665e18c5ec": "https://nftmedia.parallelnft.com/parallel-alpha/QmepQe4YTY1kgWw1tTgcYiuA8q4D1vsM1kSpciVdv7wSAJ/image.png",
  "f8003d50-9e7a-406f-9737-dcc734e90c1f": "https://nftmedia.parallelnft.com/parallel-alpha/QmUF6TrbsFzpzCcYkHBsyeaLtaUujHkL8h4L426g2NTAyb/image.png",
  "3dc6ecc0-9ad2-48f4-a74c-98ab6e84f600": "https://nftmedia.parallelnft.com/parallel-alpha/QmYfSrTu6YvciuEesH2s8TsPMAbSdDtYDpdWoepHhb3bJT/image.png",
  "b4e09c7d-91a4-4ff1-a6ef-3bfa26d22c1b": "https://nftmedia.parallelnft.com/parallel-alpha/QmX4PAMZo8TxwBf6jRNC9AS2gf1M3tw7g3mvnXqkSRnyh5/image.png",
  "e78c95c5-4352-4986-ac49-6a9764970c44": "https://nftmedia.parallelnft.com/parallel-alpha/Qmc4zoiVWeYuWLN2J68GncuHJ1jBiaduAwaZSusdQu1Rby/image.png",
  "9f0fd4e3-6332-4cf7-aa51-06456b5ac024": "https://nftmedia.parallelnft.com/parallel-alpha/QmZaqPLxkHWmy85iNCx8CPEGTrQJLBANkrJFsbkTsUuXG2/image.png",
  "60d12bad-a158-46a5-940e-c15d1fc83869": "https://nftmedia.parallelnft.com/parallel-alpha/QmSd8KKKdHFgQsqT5vfXxvcxu6XfXjxEqDgCJF2BddLzr6/image.png",
  "b4772e15-624c-4bd3-9c88-2db6cd250c4c": "https://nftmedia.parallelnft.com/parallel-alpha/QmRTcDcLr1uKnksg8hFUpYTWsnPUrkqBGxUGEUnee2atS2/image.png",
  "9ffdbdaa-811d-45f7-806f-0ce2fbcf1318": "https://nftmedia.parallelnft.com/parallel-alpha/QmRcreK7egaZEuuKZ3NdyQJQ1rt1iGLW7eBc8U6YZuDVSJ/image.png",
  "aaf2a46a-8b4b-4b06-834b-3dad8824bbf8": "https://nftmedia.parallelnft.com/parallel-alpha/QmQEoV1F6H2T2ruN2xoyGUhz8dom2AANz6uhNgvFwo2RjD/image.png",
  "3790d8f3-f360-4e0b-bbdc-bcc7396d9535": "https://nftmedia.parallelnft.com/parallel-alpha/QmRbQuz8rkL7455wbMPyzVLT4dtmUF5CfaZGu37PpQ3vCg/image.png",
  "5f6d4111-2179-4df5-a546-95aa12c90198": "https://nftmedia.parallelnft.com/parallel-alpha/QmcVB9nybPRNYRj46uxxq7yucpR4ymrocguy56dFjE1Xz3/image.png",
  "9055283c-d357-4777-92b6-d633aff3bdc1": "https://nftmedia.parallelnft.com/parallel-alpha/QmfE3gyVmtcAq8MtTQ1A7rxfQpnQJxbZE3EfJZaCYbEarh/image.png",
  "aa6a9ad2-4ec8-47f8-af95-7bee7ffca842": "https://nftmedia.parallelnft.com/parallel-alpha/QmaYxF1WRRJq6YDXhSuGtpw7wMwATBm8y3egUcqFPKoKDa/image.png",
  "ef27cf84-f2c7-4912-af74-6193efd2e976": "https://nftmedia.parallelnft.com/parallel-alpha/Qmb3USo66NxvcfzHzAjDDuzTqguW5LtvkPiAPHw5hGfmyv/image.png",
  "0fbba2e2-7d88-4eba-b9bb-0115beec64a6": "https://nftmedia.parallelnft.com/parallel-alpha/QmSxJ8J5DGWwrykMNs7BXk3Q2oMRSK5HKbSGrTdJifYpj9/image.png",
  "ae8aa84b-a3b7-40b8-94fc-cd08184bcb1e": "https://nftmedia.parallelnft.com/parallel-alpha/QmXEBoWJ9d47bwhCvKncuQ5zuAdkxJRC2sG7VdjXLtsVA4/image.png",
  "9a7dadf0-0c8f-4877-8a53-06033d7178ec": "https://nftmedia.parallelnft.com/parallel-alpha/QmWrjVLFDZuUseoHNhM3TnYyYkprgnN7qAaGcbEXM8KhQ9/image.png",
  "88b4373c-2575-42c3-9e3b-755b38e0cd78": "https://nftmedia.parallelnft.com/parallel-alpha/QmXLjG5bqpoe1ExGjJqVjTgQbeHSTr6PdHUAfjno8YzbDm/image.gif",
  "e4a8a02e-e79b-4d7a-bd2e-5e329f963b77": "https://nftmedia.parallelnft.com/parallel-alpha/QmREScSqcFakWSuWKnqGuKf7ihtqEg3Rj3dg3RaTmWHnLN/image.gif",
  "67d75280-7c33-41d7-a14c-1799257d0b3f": "https://nftmedia.parallelnft.com/parallel-alpha/QmZaT5HiFPUf1PASghBdqe5GpCjRwXQyys2BxJW859fKvB/image.gif",
  "b9d59fb7-ef5e-4f62-b154-d87e37072f86": "https://nftmedia.parallelnft.com/parallel-alpha/QmYB3Ytk97o5ZGKGV4Z4Le7CqdgKtGMEFv15jsyau2i14z/image.gif",
  "f129176d-1437-4cfb-ac90-af2c8187c327": "https://nftmedia.parallelnft.com/parallel-alpha/QmXMGykxjBYwUpPNhjruKM7QL4meh32F5eyD75eerzfdrp/image.gif",
  "68a5f6bc-8351-45ae-ab47-30b43edd016e": "https://nftmedia.parallelnft.com/parallel-alpha/QmNPjarRfLsNU2DS4iMme2nSfWuQKSSB6sGHeuijT6viZh/image.png",
  "1e9fac98-4e93-4aed-a928-d76e93cb8201": "https://nftmedia.parallelnft.com/parallel-alpha/QmcAAgsy1ha7DVPJYN5dBT3irc5dFCxLbAisX4Sp7JpQLk/image.png",
  "ac2fb5d1-6430-42c0-8e47-da91af048858": "https://nftmedia.parallelnft.com/parallel-alpha/QmdFyzRpVDbQqpp5Qrf5oCxmome2MwwaiKii5XiF7WrgoT/image.png",
  "a10ebf11-e589-40f0-85e4-462c955ce53b": "https://nftmedia.parallelnft.com/parallel-alpha/Qmf62vkwZJhGYQEMxPp8pH493T1KEcrrvkn9NUxmuLxGTb/image.png",
  "7fdf6861-74ec-4111-8bd6-a0a77e028026": "https://nftmedia.parallelnft.com/parallel-alpha/QmXyrLcAfbQd85rY9eWecN8Y1BtEC7rrfRSvvo5rVqrosA/image.png",
  "ad40540c-1a55-4ed1-a50b-71e98bd121c1": "https://nftmedia.parallelnft.com/parallel-alpha/QmXXG7ouAWkvfB3UW7t4HyRHvyma12Xc9MLgU9xeTbZZYY/image_light.png",
  "0705ed82-afea-4891-ace4-58462d1de860": "https://nftmedia.parallelnft.com/parallel-alpha/QmdkkX3haftAFTGLwKRaewA8kb536EX1ukr9svL6h2unSh/image.png",
  "dd8e3dd0-0725-403e-8f78-a68676077a0c": "https://nftmedia.parallelnft.com/parallel-alpha/QmcishF8zv5TqpzvJQyTiU37myQi7jKqhiDUqWKscg5oKV/image.png",
  "07fed2d2-df42-4b1f-86d0-ffeae4d470cb": "https://nftmedia.parallelnft.com/parallel-alpha/QmVcanzi3RtyZBfAnQ3uJ2k5wjAEEiUQs7CqFJG79otKih/image.png",
  "f7e0d473-6a4f-40c3-8a04-b645b8e3b371": "https://nftmedia.parallelnft.com/parallel-alpha/QmZq3g4Q2HQBJsy59DcHNSHbZNoLEsFfP5U45yvxLWbV1E/image.png",
  "03a5533a-2281-4dc2-a3bf-41ed6bdbc494": "https://nftmedia.parallelnft.com/parallel-alpha/Qma8G22uggX1ZwAzEaoaC74m4Vb7hYRozsZ1LehukqZNyN/image.png",
  "d96d04a5-ef74-4af8-b84d-2c3953281d04": "https://nftmedia.parallelnft.com/parallel-alpha/QmQ6wgyjyrsUzYVXRrqbhR3mApcYd9DoVAjamMazNdar1B/image.png",
  "c79571b2-cc8b-4c4d-8112-1215ab71c7d2": "https://nftmedia.parallelnft.com/parallel-alpha/QmQHKoHSZdkfpFRXbPLFr1v1YJAvnA2w6R3x5RcdExNoHq/image.png",
  "35f63f4e-70f7-4fb5-9937-9c1d9d85ae38": "https://nftmedia.parallelnft.com/parallel-alpha/QmQjeovxtPSj6sJw22Zcf3XhEPcLtVqNwikJGwFnU51xMY/image.png",
  "c466d872-4bea-42bc-98cc-79e3dc0b89ca": "https://nftmedia.parallelnft.com/parallel-alpha/QmPbRW1J6ce9FvRATqLVNCJNPRMtHtkaGdKqwJPUUwQLXP/image.png",
  "4a9cce61-6aca-4d18-9885-7339f2f6bb87": "https://nftmedia.parallelnft.com/parallel-alpha/QmXRsEmcxLG71qxo7oFt6Ee3cDGGzffV9wvNgjUPp9EgXz/image.png",
  "c041e73c-8c56-4228-93cb-e6ebc0bcc502": "https://nftmedia.parallelnft.com/parallel-alpha/QmS1QcQBWAogQkfGhXpRirLURsh4vU7NnrhZRCP38Pga5j/image.png",
  "97b3fcf7-c84e-4573-9897-f6b4ab6f00ad": "https://nftmedia.parallelnft.com/parallel-alpha/Qmd7dfirB1nxWXs1ofqfMMvXJvFDtxyn99JUspmaYyxTyA/image.png",
  "7635311d-a9c3-418b-b5fa-d15cf9e06931": "https://nftmedia.parallelnft.com/parallel-alpha/QmT3wydypGk7836kyUygJuVYWyzH63fDyXqQeBMJJKTBVo/image.png",
  "ff85d95f-6eeb-4965-9c8d-1747e17dd5e0": "https://nftmedia.parallelnft.com/parallel-alpha/QmPqJvnKbcQVbPkZYNw7JBBCRi9PNzSpdSQj6B6WGhpb2L/image.png",
  "d6aed0f2-0ff3-4611-ae13-24d73221ffa6": "https://nftmedia.parallelnft.com/parallel-alpha/QmanLbKT9ERDbpeiZwS8K1rT97fqfyzPnZinjvYiqcaNsy/image.png",
  "f090cfe6-5910-47d5-9ddb-2ab30092268a": "https://nftmedia.parallelnft.com/parallel-alpha/QmdVxbsfsTJtCH2wsFWRRJWqbtwcDGzuGZ5A3YEkHXvyjU/image.png",
  "9c5be0f5-059c-455d-a791-7549020bffc8": "https://nftmedia.parallelnft.com/parallel-alpha/QmYNco8qinMNDrPnPoWrfpY6W2oTfphi9peWbu2rRnvfok/image.png",
  "d99444f1-765f-4872-9626-56751ebbb543": "https://nftmedia.parallelnft.com/parallel-alpha/QmPGiF2RScXKhP7qin87AaEVPTFRLhF6aQ5jf2j4gt5w5D/image.png",
  "1c2f0ff2-4947-4703-9170-b10c0362a1b1": "https://nftmedia.parallelnft.com/parallel-alpha/QmVZpTsp2WYYHFj1C92DYUkqHsPjwJfhanWou5NHVqSDdt/image.png",
  "5bf76bb6-8ec5-4812-a5eb-6dfc53f6e724": "https://nftmedia.parallelnft.com/parallel-alpha/QmcBU1L1xpojFiBeuWTfAWWJCCRwr9kTuNSyyCswRVc4sN/image.png",
  "aae773b7-d310-43f3-84d5-66db2a8ed834": "https://nftmedia.parallelnft.com/parallel-alpha/QmbdY1VHEiHYj73ywdCB2xQWWhv5DaaVEmPRi6APkF3vek/image.png",
  "2f69321b-4165-4951-a331-b83b4f9da7b0": "https://nftmedia.parallelnft.com/parallel-alpha/QmVMFgachyXUBctGGwQcfjSnCZHiAjb9veqoVrDYRizHdd/image.png",
  "7235e2c1-90e3-4cb9-9083-4f16485d2ed4": "https://nftmedia.parallelnft.com/parallel-alpha/QmSJB3rokhG9fmWpiP2pV2b2hCFQP3EzbMfP6wVLgqK5PC/image.png",
  "b5199eb5-23e6-43c1-9252-d42daf8ba82d": "https://nftmedia.parallelnft.com/parallel-alpha/Qmd8FNKE2sqbtidy3frZ23aYUx5gh2bQQtMaRx8RaRTPRL/image.png",
  "589c6a88-2765-4e91-918a-deb00a191b4d": "https://nftmedia.parallelnft.com/parallel-alpha/QmcFgdksa2nh3oKtaGVj9bTjiu24P1FdJRuZjfdybuptfv/image.png",
  "9b84d10b-c36c-4a4c-ad0b-53af2b8faeb1": "https://nftmedia.parallelnft.com/parallel-alpha/QmcWDHN8QJcyuWPC6E9EAh9CFjfa1bwt9Rx4qvtaxGsLta/image.png",
  "cf56f297-df11-47a1-818f-021f5584b6e2": "https://nftmedia.parallelnft.com/parallel-alpha/Qmcvi22fmXTRSvp3E4N3Byzfymp3DMHNoNpfeT599FDmC7/image.png",
  "7795af58-3aec-4030-982d-3c6c0f43b9d9": "https://nftmedia.parallelnft.com/parallel-alpha/QmR8Tj7L6J4XHDDkU9bFmw2XabXLiCks8hX793ZjjhiTxr/image.png",
  "f9eef160-41ec-4b8f-93f7-edc80b0c4845": "https://nftmedia.parallelnft.com/parallel-alpha/QmSCXwwyrLZ1ivWBKnXWhheDFHRfnLzZg5SRJkseDnhpHi/image.png",
  "6cc46d06-7bcd-47a1-8f60-dfd53ba3f220": "https://nftmedia.parallelnft.com/parallel-alpha/QmZGjqn8zoSFRJhztK1zHFHunHwYGixHpx5UG1KaH2RdbB/image.png",
  "89a6c5a8-91bb-484f-8036-58c0d9a46d23": "https://nftmedia.parallelnft.com/parallel-alpha/QmQoiuv9a4BK9jrsQN6on7aMMTXMVMyGLJ9QCp1kfPBCMi/image.png",
  "c4bdca55-55ac-4eb2-aeb1-a6a4d2abbc20": "https://nftmedia.parallelnft.com/parallel-alpha/QmbzakMv2Bhz82LwTpW6n9s1KYb6DMzXKg5x297yRnonx9/image.png",
  "eb1bc2b5-6ebc-4c7f-b057-bb2b022fcf12": "https://nftmedia.parallelnft.com/parallel-alpha/QmeJfepr5AQbonnAz2U8K4MjErzwdNLjaavaJWhNHwBguN/image.png",
  "d76336d7-7e54-40d8-8e50-f3304db295ac": "https://nftmedia.parallelnft.com/parallel-alpha/QmckTLe1mP12fjfQU7LXZ1NjLijARxejJTSB5gCGZefKcZ/image.png",
  "41ee1330-1dc8-4579-9879-989e46909525": "https://nftmedia.parallelnft.com/parallel-alpha/QmSKkiU7RPt9KMKmRvQAibArCpxBvDymtaTufgFcNsfQK7/image.png",
  "24acb0fe-42ab-4870-ac5b-ddd5b7f51f16": "https://nftmedia.parallelnft.com/parallel-alpha/QmT2xHWCK5gq195fMwsdQ1LyJp8kbGkKsygD7rakeLTGtZ/image.png",
  "f77dff8b-7a7b-418a-a8c6-e8c89362c8da": "https://nftmedia.parallelnft.com/parallel-alpha/QmSd4fSHD3NHCAuUiiNVfot2ejREYFFCqsoK5aM2JKnZzQ/image.png",
  "3eeeb18c-9c4a-4395-9821-ed5e10526e60": "https://nftmedia.parallelnft.com/parallel-alpha/QmWyaap6xfnnw4kXan7LTb4rqztyysjqTYKgNwKAEcKFMU/image.png",
  "64b3c8ef-2f78-453e-9066-b9c6e9cf50af": "https://nftmedia.parallelnft.com/parallel-alpha/QmXGCypoTNbdUhLzKwXbQfUtVPwJ72AnbKeAPKpUND7pEb/image.png",
  "a6799706-2cfa-42b0-b26e-158feb1720b2": "https://nftmedia.parallelnft.com/parallel-alpha/Qmf4rawp5KVYNxiU7ZJvqj8vZyk3XcQfo1uEtySRQMrM1c/image.png",
  "de74bbc3-d658-4945-9f10-dfee9acd7195": "https://nftmedia.parallelnft.com/parallel-alpha/QmNqeEBYSTWB3j8MDxWpPPvfNYeHkRMa1eJ5tEBJuQAH6U/image.png",
  "c1829164-9585-4246-afd6-3596035ba223": "https://nftmedia.parallelnft.com/parallel-alpha/QmPPEpZcpPMtqE5hFFtgQECqWEFHJ17ke1cCjS6sKE2V2q/image.png",
  "0cdec675-116e-49e6-9ad4-3d3345933b5d": "https://nftmedia.parallelnft.com/parallel-alpha/QmTiNGvyC6MhK9LCeFLWhEGs8MbGRUCH2kaGLXn34bs2zG/image.png",
  "443b1a43-a34c-4aea-b807-0f968bad7a56": "https://nftmedia.parallelnft.com/parallel-alpha/QmVkxr1Fo4yFp9v4u7F4eJNpHvYR4o6ckNyXbZrWsVWt2a/image.png",
  "55c587bd-9623-4f9f-ae3a-e9a428a97ad8": "https://nftmedia.parallelnft.com/parallel-alpha/QmdY9QxG5zJNAHPgp7G24dofjKczedo6gGs55V676ig8CB/image.png",
  "91b6a57c-a55d-497d-b910-791848d9e002": "https://nftmedia.parallelnft.com/parallel-alpha/QmRLJsNP9LjZoqGe62CPow8rLjVz6UMV2fTrGNsSHNVGex/image.png",
  "c9abfb31-4da4-414a-a96b-cb3766f17584": "https://nftmedia.parallelnft.com/parallel-alpha/QmNvpSQ4UpAE2GKUu4na87XAzX9RrcQkx4fMt5ignVVpVY/image.png",
  "28751181-8812-41fa-bc48-0508ca1ed6ab": "https://nftmedia.parallelnft.com/parallel-alpha/QmdjkoYHpFR4xigiRGBmQ5agwHKbr3USCP45jTByBv7mTY/image.png",
  "07a5ab1f-f3f9-439a-908f-f5c3533ccc99": "https://nftmedia.parallelnft.com/parallel-alpha/QmUNHE8zbZPZiPQTLZywz81v5cH61kKEtiAogQXpZybT6G/image.png",
  "240a5f36-e184-4fbe-8fcd-1c9daabf478a": "https://nftmedia.parallelnft.com/parallel-alpha/QmfENooPsYS41fiCADajet7BrStojR6w9jL8EAgyhJjhwf/image.png",
  "4dc58d2d-92ed-4ef7-9875-d5baed4a02d9": "https://nftmedia.parallelnft.com/parallel-alpha/Qmchzva8EueEDP4GZS2azrVU591Xv6CAW9FBDJ7pTkEySh/image.gif",
  "f8bd692e-13e9-48fb-9485-696326a23863": "https://nftmedia.parallelnft.com/parallel-alpha/QmNihH6WWDkYBnwG5bB7BdCcCxEqUTWvLWnZR9GaRRbVKK/image.gif",
  "ddf41093-5d65-42bc-89ca-7261c73a489c": "https://nftmedia.parallelnft.com/parallel-alpha/QmYHRaoXHpgZgKtUYcxFpf44r2naHP3ZpFzz55VfsEFzjS/image.gif",
  "74c101b0-dbfe-4b9a-b1ad-de173310053e": "https://nftmedia.parallelnft.com/parallel-alpha/QmU1yMqdCDAsxNMbPmQ8MPYdFTRdQvhstMtkQYd6XKqcms/image.gif",
  "02863cb8-6a89-4c8a-bbfe-9a7a2f43c544": "https://nftmedia.parallelnft.com/parallel-alpha/QmenRpLCE1kK3XGtMieNPdjQou3S8qn8aSz4cZ7enx4k5B/image.gif",
  "a2c9e1ae-3e0c-4e94-a7dc-a5475be7c9f3": "https://nftmedia.parallelnft.com/parallel-alpha/QmWFfnkW1G1z6fzfNQuqsq5imjRRMyk7R6EdQJq8XHcDp6/image.gif",
  "bf097e9b-2066-4259-bb92-ecb6f719de2b": "https://nftmedia.parallelnft.com/parallel-alpha/QmcUWj7X3JykD3VUBvhZroQZjLoGLDBbJ9iS6UU92c5jvn/image.gif",
  "c4f5624b-aaf5-4c7c-98d7-e83e0ffac0bc": "https://nftmedia.parallelnft.com/parallel-alpha/QmeqspvPk4PXkhKpN5nEXoSqzbSDCkMSmM9ZrgqPUUBgLn/image.gif",
  "bb59bf8a-c7af-4375-9a40-cf691a3489f5": "https://nftmedia.parallelnft.com/parallel-alpha/QmYvr51PX4vNwgKpmoN8VzzRP8MrTHSak1f5pU9iQCCYxk/image.png",
  "383d864e-788e-4d03-bca0-528658173676": "https://nftmedia.parallelnft.com/parallel-alpha/QmSGK1R1HSFCxiAs3ZpnSPASvyinK8huHy7fwp4nB2aiDc/image.png",
  "ddd6115c-1bfd-4792-855d-8817ebc4b256": "https://nftmedia.parallelnft.com/parallel-alpha/QmQmjndoqAF8NWAtmfn3NXfpyGM7cJCtxh5Y5jwWB7Yh2o/image.png",
  "e1fe3d76-56f5-433d-8c6a-a1d2c31620e2": "https://nftmedia.parallelnft.com/parallel-alpha/QmTU2QPUvDaUZ1DULta3FtbtCD5uj85baZk2ZY7k53ArEq/image.png",
  "62454e13-adcf-4e0a-8782-0e0156c062bd": "https://nftmedia.parallelnft.com/parallel-alpha/Qmf2zBVhSoAoZ8BXSTP65yULCcH8XhdnaAcXEZjiKb5Ux7/image.png",
  "626cac85-b43c-4715-9d44-94d50d30d375": "https://nftmedia.parallelnft.com/parallel-alpha/QmZTtJp6kwMhu5xxEw1VEwGXMPqRa3HrqaTVCTM6BMxru3/image.png",
  "3721b690-d6e6-4a5d-8412-d646c740c771": "https://nftmedia.parallelnft.com/parallel-alpha/QmNqCTMpQVSQ1LE4LTipwp8p68S4WYP4snFbdJCWfZxFBT/image.png",
  "fc947c5e-323d-435e-8305-56c09b33749c": "https://nftmedia.parallelnft.com/parallel-alpha/Qme3Bu7VWVM9AkrXx1NtKghUmiM2kgt1Hdufk9AeVJUxpU/image.png",
  "9c8f4567-121f-4eb2-950b-3b1f1b3afb91": "https://nftmedia.parallelnft.com/parallel-alpha/QmPq2sb2fr3t5QPpECSSWY1xNPwA3hWFyyCsdbN1m8zCSU/image.png",
  "8e6087fb-a4ec-4174-87ce-9b6a6a6b98b7": "https://nftmedia.parallelnft.com/parallel-alpha/QmRjyZo2jCKWfnyUtNzjHNGZBHaoDigXiZwfNusC36QehG/image.png",
  "6c9a265f-e911-4275-bc58-b9b72239d1f3": "https://nftmedia.parallelnft.com/parallel-alpha/QmXfUX9cKCA9nZKJxYuPtrEchs7xMfg4KjXfGKuoXCeznd/image.png",
  "cedb06f1-9d63-4d8b-9d33-1f3e7db797ae": "https://nftmedia.parallelnft.com/parallel-alpha/QmSbZjoAYoaRu5QEmzS58xE3UzJ4kQp69yeYwqn2sVKqC2/image.png",
  "2520d937-a355-4b7e-9c83-03147f624b27": "https://nftmedia.parallelnft.com/parallel-alpha/QmW4r5NH2TCdqbVXjLfvMX8ae9WYe2h2wCdhTs5XCNqgjA/image.png",
  "ac66ecbd-91b7-4c86-911d-e913a832a150": "https://nftmedia.parallelnft.com/parallel-alpha/QmQUvW7fgMCCPZ11Hcg9jJ1G5PJWq58PNVotn9yuKY6dkt/image.png",
  "7ae6d527-f87e-4e10-b99a-70ce8442bc9c": "https://nftmedia.parallelnft.com/parallel-alpha/QmUrbuuRdjCtr2uUABPvhuBCchxtVE7r1ZjMb7Xx1MdUjx/image.png",
  "52dfa5bf-d605-4f06-a72e-94f1f073828e": "https://nftmedia.parallelnft.com/parallel-alpha/QmZmHHaadbx5jN34WRoHK5Lv7SGstx2CBdxC7d2PSPPUwy/image.png",
  "61bc2465-e07a-4530-9a89-0ee408243848": "https://nftmedia.parallelnft.com/parallel-alpha/QmW26KDzXZfnXZ2eQToXSdCgq9qEAwCARsHybHESo1nNV6/image.png",
  "fa93dff0-a31c-4218-8ef5-75f80436f756": "https://nftmedia.parallelnft.com/parallel-alpha/Qmezp2sqn35LZFNbuxhcTHjedpECPyn1M4N9wFore624fW/image.png",
  "efe8a70a-1ac9-4b2e-bccc-d449602890c9": "https://nftmedia.parallelnft.com/parallel-alpha/QmeTuGqiP66mBQzAmJviiXFjvrpEBvfPDGbWGR93cxUCnz/image.png",
  "3a1251e0-a780-439f-8884-0599363a8f5c": "https://nftmedia.parallelnft.com/parallel-alpha/QmQ352r5mFZhpsaAujXWdSsPUd9HRutyDj2KE8uBc4yVsi/image.png",
  "2de83173-bc5f-454c-87cb-004fca17a8e6": "https://nftmedia.parallelnft.com/parallel-alpha/QmWbgHLNjDmLGa1E3sfJ9YHJ244MvLSbsUoNZE7BPcwrWa/image.png",
  "d29b7eba-30f1-4d9e-97e4-92713a2d5fc3": "https://nftmedia.parallelnft.com/parallel-alpha/QmZcp8QozUzWTzJRV8P3tVHjqpjPAP2qDRKnH6eQG28J3L/image.png",
  "86d53ac1-46d8-487f-889e-4efb428e85c6": "https://nftmedia.parallelnft.com/parallel-alpha/QmZbAaa8rT5ieuV7eUJTUByyXwe7A1TpbnA9tHbzpD5mbS/image.png",
  "00d44f8d-de4c-41fe-b259-522da656c6d2": "https://nftmedia.parallelnft.com/parallel-alpha/QmYUPMapT4yD7pManaQb4xsPBNhmoEdP4KP1KuoJ4ypa4Z/image.png",
  "2adff81e-fd99-4f91-ba09-25b6783127d8": "https://nftmedia.parallelnft.com/parallel-alpha/QmQSHBhPmPbxVwiKpToY1uK7zzqQWScekC1hBUR8sEFySk/image.png",
  "6e6a2d82-3582-45b8-882e-17d04fda7b7a": "https://nftmedia.parallelnft.com/parallel-alpha/QmbFX3s6QCDd4fjDDfXVAYseDRwgmhEdQGrdxjW627oYKm/image.png",
  "24654ede-0e80-480e-90c9-7e6baf8f8679": "https://nftmedia.parallelnft.com/parallel-alpha/QmUszgVPKA8EyW2Ufm2DXhEVXjEj72snpqRcjnDohK8iCu/image.png",
  "101bf085-0d43-4035-a2f4-442e7d9db048": "https://nftmedia.parallelnft.com/parallel-alpha/QmPoRavXenPePwCVbZ8i6oJtAzZmCUkZAxtjj8R2nGgJ6w/image.png",
  "5c909fcc-c5c6-42a7-b5cb-af919d4ce429": "https://nftmedia.parallelnft.com/parallel-alpha/QmTJU77XKStZUwMVCdz4LHFgh1tcVC22Lw9VGe9xuYqxdn/image.png",
  "25aa8c1f-4b3d-4e2f-9d87-11727ea69684": "https://nftmedia.parallelnft.com/parallel-alpha/Qma1JrKH4FjBkwMsctWpbydrLddk6PuMwJFv9LvqNwyUVY/image.png",
  "9566ce42-be1b-4509-abfd-edd4a531e64d": "https://nftmedia.parallelnft.com/parallel-alpha/QmXQ7SXKmJkPDSahfCKdz7zgS3Zirc3gsCY7RM4834D9g1/image.png",
  "51e99d47-b0af-4440-ba17-6210192315e9": "https://nftmedia.parallelnft.com/parallel-alpha/QmdgiA3amKJnjr7hHxH5didfQ778pbHJJyRrXhf1x6DLC7/image.png",
  "2af7c30f-c68b-46d2-941f-0ecca245228c": "https://nftmedia.parallelnft.com/parallel-alpha/Qma2mmxYpx2xgycoAJgixKTkZJMHpW12NucpTY8dxrrwyY/image.png",
  "c627fb32-2fac-436a-94a0-088b920f0a22": "https://nftmedia.parallelnft.com/parallel-alpha/QmPMjwePhZXBAyLUbHYiyaYQCapRqvMJBbGyBoBkHFF14m/image.png",
  "0145a980-3b80-4587-b4d9-8859a72d61cb": "https://nftmedia.parallelnft.com/parallel-alpha/QmXPgwkbDs4bPR265HupwS6eYnPzSErMeSrdqD9KcAymJx/image.png",
  "4636ba50-88e7-46df-882e-ffb394267173": "https://nftmedia.parallelnft.com/parallel-alpha/QmPWH3xHNcptz2m7NWcLYyTKpF3TdaoZcY2AwrBHgbLkTf/image.png",
  "105173b3-2cd2-4e53-86e2-130b8c5e5c57": "https://nftmedia.parallelnft.com/parallel-alpha/Qma2mnsg8siHaXeLknT3UUAZjQqExz9iMHaXntEAGCYuBP/image.png",
  "05a66c44-953f-4c60-950e-f9da55554edd": "https://nftmedia.parallelnft.com/parallel-alpha/QmayvAjrddeLup4iPBcXAncvVpRF8nQ5Z3iNAWpTAN3UJv/image.png",
  "1b409581-72ed-48d7-b56f-a856a679bd69": "https://nftmedia.parallelnft.com/parallel-alpha/QmYcPSRSJi8Z1RgrDksmQs5VGe5h4XU2PDcF6fJaU6VANK/image.png",
  "29678aae-f567-4979-aa60-738342311485": "https://nftmedia.parallelnft.com/parallel-alpha/QmPZvaVT4pVR2SKYtF1zJkKssp5GLSHhreFrfwtTzVM2C3/image.png",
  "706522d8-c28a-4a2b-bcd7-9cca371ba1e0": "https://nftmedia.parallelnft.com/parallel-alpha/QmcUu6RMY85pksu5S9owQcumvCMPDo5Ju3s1t411e4t5uU/image.png",
  "860fd394-4e25-45e4-8f30-93858aa0c915": "https://nftmedia.parallelnft.com/parallel-alpha/QmVYpQUSJHGj5w9EQ9niZwQg1bJgNwKto6jbxs5nZvQBQ7/image.png",
  "adc4a98c-6960-4465-9a84-2637f532e888": "https://nftmedia.parallelnft.com/parallel-alpha/QmPSF2qV14NSMTExMKaaQfQf7gmenFVjKfj9fvyXxkdq2E/image.png",
  "514a8ea2-27bf-4ce9-a2ad-c5fa37d8fe37": "https://nftmedia.parallelnft.com/parallel-alpha/QmV4nKtR3bbPaCiC4H9UuVsUo8i4MmagUq9WpUCF3i2Pwp/image.png",
  "262a7c4e-cc32-4f39-9c23-81636c52942e": "https://nftmedia.parallelnft.com/parallel-alpha/QmVJnLBJ72FauDYEBAvKUZE8hNVsnDYywqLrRkthKG6vnw/image.png",
  "df7f7a60-8db4-4078-b27f-119394ae6856": "https://nftmedia.parallelnft.com/parallel-alpha/QmZCLRZY4W7dFCiEQBkeiUvBwtf5PHNNt84VcLAvbdTZHA/image.png",
  "49009226-3bbc-4059-a920-a0ee5c551481": "https://nftmedia.parallelnft.com/parallel-alpha/QmYc8dwHt7nRNKWUARZn2j5GgKyVBeJYFwthyn79pVJsvS/image.png",
  "68cef97a-9d4e-4036-b18e-ecc6c74623d3": "https://nftmedia.parallelnft.com/parallel-alpha/QmUE5m2QLFex68fwpUFLcoRKvTDXV6uLPmjatvimTBWhBH/image.png",
  "342b6a3d-579a-4d39-b9cb-f777ebc1869c": "https://nftmedia.parallelnft.com/parallel-alpha/QmSqW2b8xHTh1ofpKnwLVaHkFZL7SXhuCkXespxFjcRp4a/image.png",
  "2b5de42a-9e2f-4e42-8f30-889e2cfc04da": "https://nftmedia.parallelnft.com/parallel-alpha/QmfQjs3SmEsDm3g2CH4AVSrzNiVfJSbyhAnvq7Ft36D26J/image.png",
  "3ae57ef1-1143-4606-9b3b-cd261fb28a44": "https://nftmedia.parallelnft.com/parallel-alpha/QmXP2VBxXpJY6LcuWa2pciebNjavxta95xDpn4L9uiG32P/image.png",
  "8ed131c3-c699-466b-b330-ff705ba6977c": "https://nftmedia.parallelnft.com/parallel-alpha/QmeZieHVNeaLV17nKRCYoC9sw8gxxPD8xTdSKddp2Bwo3i/image.png",
  "954526d8-f39f-4454-856b-6936a7675f90": "https://nftmedia.parallelnft.com/parallel-alpha/QmQc8hti3m4kw9gW3Y46k4hBaZdPaaLnqaBzJkGnGEpLj7/image.png",
  "d32432f3-8f20-496f-a553-c3a72ad53fbe": "https://nftmedia.parallelnft.com/parallel-alpha/QmdnMGnvijVppsgevQ72ZawDUv1JLSKGbkB6jw4LiJQJ4Y/image.png",
  "508c2805-b031-4d02-8af5-67dc8fd9885a": "https://nftmedia.parallelnft.com/parallel-alpha/QmV7dpUvYi1ynChM339WdyFZ9BA72acdgq8grKHNZytaCp/image.png",
  "66101636-5cfc-4a25-ae47-11b7b1b006c9": "https://nftmedia.parallelnft.com/parallel-alpha/Qme9v4z7nTxjBhZWLEwfkUCwpKrbxQEhYxE8p8nthT6C5c/image.png",
  "86e7d455-64b7-4431-8d12-894d976e9aeb": "https://nftmedia.parallelnft.com/parallel-alpha/Qmf4M5HxKepHwyX6fu8KacPULpetYy8ZjYeCjHXwuhrz61/image.png",
  "84ce5edf-af5f-4c9b-b410-b66198cedaf1": "https://nftmedia.parallelnft.com/parallel-alpha/QmVWvuSwENHWzQxXYZRaqKWuAcULzUxgRWKVzWiKqHhyho/image.png",
  "20e6a928-ef69-4bfd-b574-fc2221ce8af5": "https://nftmedia.parallelnft.com/parallel-alpha/Qmaruefan9f75W53CBZ729uhX8YZpfKLx2pqZ2jHSGCRBY/image.png",
  "18439978-527b-441e-8982-2c4cc75e39ee": "https://nftmedia.parallelnft.com/parallel-alpha/QmV6nWSEMpBsHgvTP45juC7ZXxDF3hQK66EQ5NcMZfDMp9/image.png",
  "3eb47a27-2981-473a-9eba-6ec00737840e": "https://nftmedia.parallelnft.com/parallel-alpha/QmXGpjMqnebeuxkoTueDf2w3p4hk6eZu2p9HrG6YhZ6jnP/image.png",
  "b3868c21-45a4-47ed-b93b-b3d6cd9766e6": "https://nftmedia.parallelnft.com/parallel-alpha/Qmc4pAyRcWWoT68sxXLCUCq8fuNW9Cyp1DUNF3bTX9FqYy/image.png",
  "4d80148e-e4e7-4be2-8e9c-b8b43dae8bf6": "https://nftmedia.parallelnft.com/parallel-alpha/QmXhfAVRiGXwY3L53PnjhADnChGAXu3SpMBNw9UkZPuhQ5/image.png",
  "7529216c-3efe-4c68-b373-e26a8cb04d32": "https://nftmedia.parallelnft.com/parallel-alpha/Qmc8mScgxxHmvunGPz7LVgVhx7cd4bjnynoA3dMb78kJhT/image.png",
  "0d9e6c3e-8379-49a8-af7e-233baf57a5e3": "https://nftmedia.parallelnft.com/parallel-alpha/QmS47thgZHAX49Knq2TuH2EJaAekTwhEgvcmH4TiC3x6pr/image.png",
  "d90c3eb6-0ea7-4e44-9a45-5ad7f9cca62a": "https://nftmedia.parallelnft.com/parallel-alpha/QmWuU6jCdhk3myXhwMUa9mVmPLwWutFiWRSXYcgDRsJmfp/image.png",
  "8478b0e3-0467-4f52-8f4d-99cdef8fd4af": "https://nftmedia.parallelnft.com/parallel-alpha/QmP2JZbzrqPup7eJvzYzMvZ4taHMLRYtHMsdcCb1Hihx8V/image.png",
  "92d94413-fb7b-45e3-8ee0-5f874697249a": "https://nftmedia.parallelnft.com/parallel-alpha/QmWeFdXcQzRq7z32yP3gAaTEejU3q8MaDKFuadRDmo1bS5/image.png",
  "d098369b-e73f-4810-a582-898463101737": "https://nftmedia.parallelnft.com/parallel-alpha/QmbK6MhQn56Cz5xdyD25xkA6G4xkF4m2mm4FtVjhXZKme6/image.png",
  "d62b1d4f-299a-4ef7-a30e-f4bba9396564": "https://nftmedia.parallelnft.com/parallel-alpha/QmenK9MVkxwfNDay4LHpsQBZg2rxtMa9HiYhkf9pWMiE4k/image.png",
  "6b53c080-42b3-4d25-a994-7ed15e26b53a": "https://nftmedia.parallelnft.com/parallel-alpha/QmRvyswJ5wwZLzy1efrv3jN6pDrLxiE46btWf4RZEvr1kU/image.png",
  "8d619381-85b1-4dc1-839f-cf43a109aa32": "https://nftmedia.parallelnft.com/parallel-alpha/QmScrGBKYwUo21ZcFDR8PxL7nP7PfgJx3MFhY1pSTsmD9o/image.png",
  "28cf7f2d-aa46-40bc-a7d4-77839f613b1f": "https://nftmedia.parallelnft.com/parallel-alpha/QmWZUQGJoJj4HUo9P4Az22kWpHcHLn5rWUA5LhWMYeMLHr/image.png",
  "50b35b9a-3c58-42c3-b67c-d2f8806f0e3c": "https://nftmedia.parallelnft.com/parallel-alpha/QmRnGF25BGMqpYnRQbD9t9qZU187DBHPYitEbhzx1FF3z2/image.png",
  "4868cbd8-c03d-4d3a-86b4-cad8f2a409bb": "https://nftmedia.parallelnft.com/parallel-alpha/QmSmVFyUuDJgvBWyWismJYf58xvk9ULEGon8cW5sxdFhML/image.png",
  "3e86063c-41bf-44cc-a0c9-474c60b2adca": "https://nftmedia.parallelnft.com/parallel-alpha/QmU7ZJwe3yT5vNicVC3fiEpSH4t9BD22atQkikZPZZDmdZ/image.png",
  "7e01c560-2393-41f2-9406-732733beb3c8": "https://nftmedia.parallelnft.com/parallel-alpha/QmXMDzMYV5Bcx9NPpb5SETFf54nSkk1PKpnLewLK9uphVN/image.png",
  "58c55a30-9ce0-48f4-b5e7-2ad33372537f": "https://nftmedia.parallelnft.com/parallel-alpha/QmPwVwsZDMwLbS1xWzd3a3ycNrECKHoxe8XLgwtZwM9qvD/image.png",
  "882f0267-5177-439c-9c66-8d4415aac8e3": "https://nftmedia.parallelnft.com/parallel-alpha/Qmf3iBMfaSGV23jLYccaVBW1doAfu2UGkkxPonw8sAVdK9/image.png",
  "a6358267-417e-4b2e-b165-dd1f39f28ac0": "https://nftmedia.parallelnft.com/parallel-alpha/QmSYq6b6hPqMthbWCj84jVsbW5ZYH96EGrSTFnNf2yXpz6/image.png",
  "28c340b1-8ba6-42f7-9d3f-fd738d045b96": "https://nftmedia.parallelnft.com/parallel-alpha/QmdpHFaCD5Dq2sEEkzVU7bJamXEX5g9TV2fEC3gzoXkKh6/image.png",
  "3d1a9c7c-9b4f-428a-9aeb-b992b6d94b8e": "https://nftmedia.parallelnft.com/parallel-alpha/QmZca7ZutquYaPxdDbekvC2oXRMpWSkBnAGtQyb6dd4SSs/image.png",
  "423ed3e5-b727-4990-b54d-1adadbe04305": "https://nftmedia.parallelnft.com/parallel-alpha/Qmayhr8TD8nVQzptjRfWQjNCyp15QgAqPskY1kmYGsk7oY/image.png",
  "16c364af-2b53-4242-983a-0ba35d8dd6ff": "https://nftmedia.parallelnft.com/parallel-alpha/QmYx8aq5wRRDqMNgXLRMzacdwgyRJd84WHGYiBNKB7F91x/image.png",
  "61c731bf-1569-4e8a-8f08-80008344f0a7": "https://nftmedia.parallelnft.com/parallel-alpha/QmRn9bwMhpr9ic9w7jYKXwaBtXuXmb3Z7EDeDVeJrPWYKo/image.png",
  "acc1338d-ba92-4e55-a320-4fe6568cba69": "https://nftmedia.parallelnft.com/parallel-alpha/QmT77K4TNdb9Nt8Qqh4YZyGVn7dWSxkzbyVaEq5AcRNaFQ/image.png",
  "c1dba4c7-8c2c-47a0-8aa4-d0b621144eae": "https://nftmedia.parallelnft.com/parallel-alpha/QmUDiTZtbHLdWdyZxTdPACJeC6BkRK7ARn2vGwQo9z1ma4/image.png",
  "08ee570b-9ba9-45e2-947c-f85dc434bc10": "https://nftmedia.parallelnft.com/parallel-alpha/QmPwmwsC2bDmCAfQMcBwYUpuwVtDCK3Wpz4FKJ1HF5WdcZ/image.png",
  "fba113e6-8f47-4763-b86e-02ef87f79250": "https://nftmedia.parallelnft.com/parallel-alpha/QmbKRhvPuLi4v1aEGHBhYuUkFMhZZ28nohu5VJjiSqwdGB/image.png",
  "738aabc7-4e9c-47af-aa33-2bdbac2121e9": "https://nftmedia.parallelnft.com/parallel-alpha/QmW94BDPewdtg1nFxr3PHxU9cNeChazuRUgaAait9PBWo5/image.png",
  "076f81eb-ef8e-4cc3-95fc-a866b2926864": "https://nftmedia.parallelnft.com/parallel-alpha/QmcNrZNuuCwNe1XwGp5f5P2cn7KGgsxhJfLPb9hCYZz6vt/image.png",
  "5412df21-f36e-48bc-9f07-ed5f5853a6e5": "https://nftmedia.parallelnft.com/parallel-alpha/QmNc1giA4n1vgXtXhVdLkCKtyX3Qpz3mmUJ4Ub9KcM5qFS/image.png",
  "0599895f-2604-49ef-9a9c-c371258ff0fc": "https://nftmedia.parallelnft.com/parallel-alpha/QmPFaNSNch6PitTc64M9xjKgppck1UWW26PFtoSFU5XAhY/image.png",
  "af9fff6f-a3e3-4f69-9308-499303166d0b": "https://nftmedia.parallelnft.com/parallel-alpha/QmdGhM6Qbw7ocMGUTM8cRfotMUZV7Ao5vRDSi2EypRXzYL/image.png",
  "ab512b21-ef63-491d-88d3-6a1e662c931f": "https://nftmedia.parallelnft.com/parallel-alpha/QmcAYVW4b1G3mm1EzYKbrZTpetjpG6iVVAwzDUjQDprBoa/image.png",
  "d953903b-2fae-4b09-862d-0761a9f40952": "https://nftmedia.parallelnft.com/parallel-alpha/QmS1DJ5ee4z2NZKC6z9jH8sqHiCt8PuBz3DzmxUK21xzsP/image.png",
  "6758cd68-a7e9-4518-a0a2-314a0b161ca2": "https://nftmedia.parallelnft.com/parallel-alpha/Qmc4pAyRcWWoT68sxXLCUCq8fuNW9Cyp1DUNF3bTX9FqYy/image.png",
  "f0e60610-e7e0-4238-acfd-6a8e7a84ee60": "https://nftmedia.parallelnft.com/parallel-alpha/Qmat3CsbzAZ5JEbzr2ys3dWnfsGAEz3e4hAN7uwr2Tukta/image.png",
  "54bfedb0-f82a-4b53-a24d-21a02a1d5dc6": "https://nftmedia.parallelnft.com/parallel-alpha/QmeHU52dkiMo7ExfPJrd6Av23pjn8zMTBktDtzXUYj1PFz/image.png",
  "abbfe0f5-e96d-4f4b-9222-723b33f32c00": "https://nftmedia.parallelnft.com/parallel-alpha/QmZq1Z4bDHEJgGPVqFh8h2zpuxUtMx2b4QZxboWWJatBzg/image.png",
  "d1ff9d71-b193-420d-bb18-54c47d648557": "https://nftmedia.parallelnft.com/parallel-alpha/Qmd217uTh3GizTEyAh6sAGUctNzQKtLRjqU79SoFupARP5/image.png",
  "030452dd-1aec-4546-881a-de96406f573a": "https://nftmedia.parallelnft.com/parallel-alpha/QmRpsg75qkjQeroTZkpMNcYDh7zUU7sF6vgMxU6tnpHqjp/image.png",
  "46f43662-b13d-4c3b-93b7-670c4055d30e": "https://nftmedia.parallelnft.com/parallel-alpha/QmeG9DSXWgVbdxXw3qf9d5KtMKLDLGzBhMwetRMavCTKTU/image.png",
  "dad48b97-8bfe-43f1-965b-9df9b0d71ee3": "https://nftmedia.parallelnft.com/parallel-alpha/QmNzy9JDBAkAWrNL6rMokQraZ8TzQBTYJg3hny7PEYcY6c/image.png",
  "7fd8e1a9-655d-4862-8415-198d5b35eded": "https://nftmedia.parallelnft.com/parallel-alpha/QmYFire8Nf1Qj6L4BiEYZBvyq7xbkrQcqn5C2Czvg2mmmM/image.png",
  "af5ab0c5-c258-4d1a-a583-cee96cde023f": "https://nftmedia.parallelnft.com/parallel-alpha/QmPzKdqaMaheeQz3xknyBSnCrA8sE54gxKNcPKa5ZDH9zd/image.png",
  "94dba81c-984c-4c58-a9f5-6f6f5b927957": "https://nftmedia.parallelnft.com/parallel-alpha/QmQbPsoQzvC4rw1at9NFGAjFuPPspGKKL2Ng8S7X4FV3eo/image.png",
  "f6a06b2f-b057-445c-93a9-634fb45003cf": "https://nftmedia.parallelnft.com/parallel-alpha/QmXBnLZ13Zv7Bim1EKPANFkVmRzXcnLVW7XtAP4eDzFuUn/image.png",
  "0b8b4484-f2b7-4d8c-b970-164d807c474e": "https://nftmedia.parallelnft.com/parallel-alpha/QmNfRYJqDQvihqBHxuXctko2JP9L7wuBTXZVYVgriLZXST/image.png",
  "5201c47e-f3ce-45f1-8a4f-d6ba8e8b8cc8": "https://nftmedia.parallelnft.com/parallel-alpha/QmYyU5Hrqr6sy8FnkcSUTkVSacnWmqVFraRLkYKhkGB6xB/image.png",
  "28b42ec6-fc35-4285-9784-afd87b57c0bb": "https://nftmedia.parallelnft.com/parallel-alpha/QmZnwqh13VrLUSpXSpKXoJyE6zGSP1hBL3YAp2hbiof5e5/image.png",
  "999f96b4-5028-4f21-be92-44bf4c365d5c": "https://nftmedia.parallelnft.com/parallel-alpha/QmeQAiJJW9anRybUKsgoogEZF7z1NEAxLX5LXShN2sgA4K/image.png",
  "0e1b4d5a-9cc6-4084-a484-316af3d4f274": "https://nftmedia.parallelnft.com/parallel-alpha/QmYjHWuimyXMoukafR8HNzkugN4ZyyfeuGiVDsEbmNC3Yu/image.png"
}

const pools = {
  "parallel": "YPGHP7VAvzy-MCVU67CV85gSW_Di6LWbp-22LGEb3H6Yz9v4wOdAaAhiswnwwL5trMn8tZiJhgbdGuBN9wvpH10d_oGVjVIGM-zW5A.avif",
}

async function optimizeImg([id, url]) {
  const folder = join(cwd(), 'public/img', id);
  if (!existsSync(folder)) await mkdir(folder);
  const res = await fetch(url);
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  const animated = url.endsWith('.gif');
  const img = sharp(buffer, {animated});
  return Promise.all([
    img.toFormat('webp').toFile(`./public/img/${id}/original.webp`),
    img.resize({ width: 50 }).toFormat('webp').toFile(`./public/img/${id}/50w.webp`),
    img.resize({ width: 150 }).toFormat('webp').toFile(`./public/img/${id}/150w.webp`),
    img.resize({ width: 300 }).toFormat('webp').toFile(`./public/img/${id}/300w.webp`),
    img.resize({ width: 450 }).toFormat('webp').toFile(`./public/img/${id}/450w.webp`),
  ]);
}

async function main() {
  return Promise.all(Object.entries(tokens).map(optimizeImg));
}

main();
