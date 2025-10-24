export const API_BASE_URL = "https://stylenest-mi9i.onrender.com/api";

export const categories = [
  {
    slug: "mulher",
    name: "Mulher",
    title: "Moda Feminina",
    description:
      "Peças femininas selecionadas para quem busca estilo e conforto em qualquer ocasião.",
    heroImage:
      "https://odefensor.com.br/wp-content/uploads/2025/02/Tendencias-de-moda-feminina-para-2025-conforto-e-estilo-em-cada-detalhe-2.png",
  },
  {
    slug: "homem",
    name: "Homem",
    title: "Moda Masculina",
    description:
      "Looks masculinos versáteis que acompanham do dia a dia aos momentos especiais.",
    heroImage:
      "https://lojamakenji.vteximg.com.br/arquivos/ids/192891-450-550/173425026_01.png?v=638818132624270000",
  },
  {
    slug: "kids",
    name: "Kids",
    title: "Moda Kids",
    description:
      "Conforto e leveza para os pequenos, com peças lúdicas e cheias de personalidade.",
    heroImage:
      "https://img.freepik.com/fotos-premium/moda-menino-e-menina-em-roupas-elegantes-na-parede-colorida-roupas-brilhantes-de-outono-em-criancas-uma-crianca-posando-em-uma-parede-rosa-roxa-colorida_86390-4442.jpg",
  },
];

const defaultSizes = ["PP", "P", "M", "G", "GG"];

export const productsByCategory = {
  mulher: [
    {
      id: "mulher-1",
      name: "Camiseta arredondada preta e branca",
      price: 119.9,
      image:
        "https://ph-cdn3.ecosweb.com.br/imagens01/foto/mkp43/moda-feminina/camisas/kit-com-2-camisetas-feminina-enfim-1000058544-branco-preto_2299389_301_1.jpg",
    },
    {
      id: "mulher-2",
      name: "Blusinha Podrinha básica",
      price: 59.9,
      image:
        "https://images.tcdn.com.br/img/img_prod/1022581/kit_3_blusas_podrinha_preto_fucsia_verde_bandeira_6021_1_64e86fa4eb7c82f3f31acc4e7598a49f.jpg",
    },
    {
      id: "mulher-3",
      name: "Calça Jeans Cargo Destroyed",
      price: 169.99,
      image: "https://i.pinimg.com/236x/7d/36/1c/7d361c0ade13a57672c6036e4f07c519.jpg",
    },
    {
      id: "mulher-4",
      name: "Cropped duna com bojo com manga",
      price: 79.9,
      image: "https://i.pinimg.com/736x/77/36/fb/7736fb3b7008b37cd632c678ba51e37f.jpg",
    },
    {
      id: "mulher-5",
      name: "Camisa Feminina Competição Manga Curta",
      price: 89.9,
      image:
        "https://images.tcdn.com.br/img/img_prod/762709/camisa_feminina_competicao_manga_curta_camille_zip_hdr_5423_variacao_1897_4_cdc7356e813fc037f7c75229233f6f06.jpg",
    },
    {
      id: "mulher-6",
      name: "Camiseta Rosa Feminina Dry Fit",
      price: 59.9,
      image:
        "https://static.netshoes.com.br/produtos/kit-4-camisetas-feminina-dry-manga-curta-protecao-uv-slim-fit-basica-academia-treino-fitness/11/Q5B-0005-411/Q5B-0005-411_zoom1.jpg?ts=1720709196",
    },
    {
      id: "mulher-7",
      name: "Jaqueta Feminina Casulo",
      price: 89.9,
      image:
        "https://cdn.dooca.store/6878/products/cavfqqm4tev9p6j9qfsonrxpwq6iqmtlkeds_2000x2300.jpg?v=1682709951&webp=0",
    },
    {
      id: "mulher-8",
      name: "Camisa em Cetim com Recortes",
      price: 49.9,
      image: "https://img.lojasrenner.com.br/item/874246909/original/12.jpg",
    },
    {
      id: "mulher-9",
      name: "Camiseta Oversized Estampada Branca",
      price: 129.9,
      image:
        "https://cdn.awsli.com.br/1500x1500/1975/1975968/produto/301826693/07-0yx31eqqz8.jpg",
    },
    {
      id: "mulher-10",
      name: "Calça Jeans Cargo Preta",
      price: 169.9,
      image:
        "https://shop2gether.fbitsstatic.net/img/p/calca-feminina-cargo-jeans-preto-219348/601574.jpg?w=1225&h=1633&v=no-value",
    },
    {
      id: "mulher-11",
      name: "Vestido Curto Um Ombro Só",
      price: 99.99,
      image:
        "https://www.lezalez.com/dw/image/v2/BFCG_PRD/on/demandware.static/-/Sites-masterCatalog_Lunelli/default/dw42378edd/large/lezalez-1.6962L-017650-D1.jpg?sw=1800&sfrm=jpg&sm=fit&q=80",
    },
    {
      id: "mulher-12",
      name: "Vestido Retrô Anos 60",
      price: 119.9,
      image: "https://modera.com.br/4230-large_default/vestido-retro-preto-p10.jpg",
    },
    {
      id: "mulher-13",
      name: "Calça Jeans Cropped",
      price: 189.9,
      image:
        "https://d3vnyi5j6ba1mc.cloudfront.net/Custom/Content/Products/16/20/1620378_calca-jeans-feminina-cropped-24607009_l1_638270785930917359.webp",
    },
    {
      id: "mulher-14",
      name: "Calça Jeans Skinny",
      price: 129.9,
      image:
        "https://static.ferju.com.br/public/ferju/imagens/produtos/calca-jeans-feminina-adulto-skinny-detalhe-desfiado-70006-absolute-jeans-6601d1b01b82c.jpg",
    },
  ].map((product) => ({ ...product, sizes: defaultSizes })),

  homem: [
    {
      id: "homem-1",
      name: "Jaqueta de Couro",
      price: 129.9,
      image:
        "https://cordilheira.com.br/cdn/shop/files/JAQUETA_CORDILHEIRA_OUTDOOR_-_DIREITOS_DE_IMAGEM_RESERVADOS_A_CORDILHEIRA_BRASIL_-_JAQUETAS_CORDILHEIRA_-_JAQUETAS_IMPERMEAVEIS_2.png?v=1745891596",
    },
    {
      id: "homem-2",
      name: "Jaqueta Outdoor Impermeável",
      price: 129.9,
      image:
        "https://espacoshop.com/cdn/shop/files/S8e5740ed08c14d0d9c5d6ba8ea8ffef9t.jpg?v=1711647640",
    },
    {
      id: "homem-3",
      name: "Conjunto de Moletom",
      price: 229.99,
      image:
        "https://3vs.fbitsstatic.net/img/p/moletom-canguru-verde-cartel-3vs-68277/255155.jpg?w=511&h=650&v=no-value",
    },
    {
      id: "homem-4",
      name: "Moletom Canguru Estampada",
      price: 149.9,
      image: "https://cdn.awsli.com.br/1897/1897332/produto/94064219/24840df940.jpg",
    },
    {
      id: "homem-5",
      name: "Camiseta branca poliéster",
      price: 59.9,
      image:
        "https://images.tcdn.com.br/img/img_prod/701745/camiseta_manga_curta_poliester_1560_2_aa735d041ee776544b2f4ba751adab8b.jpeg",
    },
    {
      id: "homem-6",
      name: "Camiseta de Algodão",
      price: 59.9,
      image:
        "https://keepdream.cdn.magazord.com.br/img/2024/12/produto/843/camiseta-oversized-preta-basic-frente.jpg",
    },
    {
      id: "homem-7",
      name: "Camiseta Oversized Básica",
      price: 79.9,
      image:
        "https://cdn.awsli.com.br/600x1000/24/24730/produto/252815326/stb23mc068---camiseta-oversized-eita-atras-de-vish---frontal-egs5uq9xw7.png",
    },
    {
      id: "homem-8",
      name: "Camiseta Oversized Estampada Vintage",
      price: 129.9,
      image:
        "https://dcdn-us.mitiendanube.com/stores/001/886/076/products/_dsc0984-personalizado1-8e5db40130cd69c84c16597030004926-1024-1024.jpeg",
    },
    {
      id: "homem-9",
      name: "Calça cargo jeans",
      price: 169.9,
      image:
        "https://imageswscdn.wslojas.com.br/files/24465/produto-calca-cargo-sarja-fire-reta-verde-musgo-1755.jpg",
    },
    {
      id: "homem-10",
      name: "Calça cargo preta",
      price: 169.9,
      image:
        "https://acdn-us.mitiendanube.com/stores/162/062/products/cargo-preta051-71214574dcfdea69ff16637757371287-1024-1024.jpg",
    },
    {
      id: "homem-11",
      name: "Calça Militar tática cargo",
      price: 189.9,
      image: "https://down-br.img.susercontent.com/file/sg-11134201-7reow-m1u2rmitqu8u0c",
    },
    {
      id: "homem-12",
      name: "Calça Militar tática",
      price: 189.9,
      image: "https://down-br.img.susercontent.com/file/br-11134207-7qukw-lf17ri5a9bl7ab",
    },
    {
      id: "homem-13",
      name: "Calça Militar Forhonor 911",
      price: 199.9,
      image: "https://cdn.awsli.com.br/600x700/1759/1759278/produto/132118606183edfbec1.jpg",
    },
  ].map((product) => ({ ...product, sizes: defaultSizes })),

  kids: [
    {
      id: "kids-1",
      name: "Calça Jeans Juvenil Feminina Wide Leg",
      price: 139.9,
      image:
        "https://fernandaramoskids.com.br/wp-content/uploads/2024/02/fernandaramoskids_com_br-calca-jeans-juvenil-feminina-wide-leg-com-destroyed.jpg",
    },
    {
      id: "kids-2",
      name: "Kit roupas infantis Vestidos e Calças",
      price: 99.9,
      image:
        "https://cea.vtexassets.com/assets/vtex.file-manager-graphql/images/c81f6cc6-e21e-4b05-9c7a-d9b59b2ba99a___f2fedd0912877fa7bbd130bb2df67987.png",
    },
    {
      id: "kids-3",
      name: "Conjunto Infantil Festa na Roça",
      price: 79.99,
      image:
        "https://images.tcdn.com.br/img/img_prod/1164817/conjunto_infantil_festa_na_roca_972_1_6e9ce24d1454a299731d3833d0b531ed.jpg",
    },
    {
      id: "kids-4",
      name: "Roupas Kids Infantil Feminina",
      price: 99.9,
      image:
        "https://cdn.awsli.com.br/300x300/2724/2724906/produto/360085808/74e803c5-efc2-11ef-957a-f23c92c12283-0mq1jfgu4v.jpg",
    },
    {
      id: "kids-5",
      name: "Look Estiloso para Festas",
      price: 89.9,
      image: "https://auhekids.com.br/wp-content/uploads/2021/03/roupa-estilosa-menino-festas.jpg",
    },
    {
      id: "kids-6",
      name: "Camiseta Festa Junina",
      price: 79.9,
      image:
        "https://kidstok.cdn.magazord.com.br/img/2025/04/produto/8151/amcs1419-marinho.jpg?ims=fit-in/290x435/filters:fill(white)",
    },
    {
      id: "kids-7",
      name: "Roupa Festa Infantil Suspensório",
      price: 129.9,
      image:
        "https://img.elo7.com.br/product/zoom/330D70D/roupa-festa-infantil-camisa-pipas-bermuda-suspensorio-conjunto-roupa-festa-infantil-menino.jpg",
    },
    {
      id: "kids-8",
      name: "Roupa Infantil Feminina Malwee",
      price: 109.9,
      image:
        "https://static.ecosweb.com.br/public/produtos/roupa-para-menina/conjunto-verao/conjunto-off-white-follow-your-heart-malwee-kids_763185_301_1.webp",
    },
    {
      id: "kids-9",
      name: "Roupas de inverno Feminino e Masculino",
      price: 199.9,
      image:
        "https://www.maripelomundo.com.br/wp-content/uploads/2015/10/baby-onesies-baby-coat-baby-wear-winter-clothes-2.jpg",
    },
    {
      id: "kids-10",
      name: "Roupa Infantil Unicórnio",
      price: 109.9,
      image:
        "https://grupokyly.vteximg.com.br/arquivos/ids/282851-500-500/1000864_0467.jpg.jpg?v=638785953539870000",
    },
    {
      id: "kids-11",
      name: "Conjunto Social Infantil com Suspensório",
      price: 189.9,
      image: "https://cdn.awsli.com.br/2500x2500/1953/1953797/produto/153528455938de1e82b.jpg",
    },
    {
      id: "kids-12",
      name: "Camisa social + Bermuda Jeans Masculina",
      price: 159.9,
      image:
        "https://thumb-cdn.soluall.net/prod/shp_products/sp1280fw/cd45bd2a-1aac-4049-a165-b7b07dd2a1bb/ab4a8e23-7750-42e3-8130-b8d1a68c7153.jpg",
    },
    {
      id: "kids-13",
      name: "Vestido Infantil de Menina Listrado Preto",
      price: 219.9,
      image:
        "https://io.convertiez.com.br/m/essencialenxovais/shop/products/images/32435/medium/vestido-infantil-de-menina-listrado-preto_68092.JPG",
    },
  ].map((product) => ({ ...product, sizes: ["2", "4", "6", "8", "10", "12"] })),
};
