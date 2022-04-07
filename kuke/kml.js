const mysql = require('mysql2/promise');
const axios = require('axios').default;

const connPool = mysql.createPool({
  host: '192.168.0.91',
  user: 'test',
  password: 'test!@#',
  port: 3306,
  database: 'kuke_music_library'
});

async function index_documents(sql, skip, page, doc) {

  try {
    let finished = false;
    while (!finished) {

      const [rows, fields] = await connPool.query(sql, [skip, page]);

      if (rows.length > 0) {
        await axios.post(doc, rows,
          {
            baseURL: 'http://localhost:3002/api/as/v1/engines',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer private-zfgpdow7er93m859wpuo4snv'
            }
          });
        skip += rows.length;
        console.log(doc + ' has processed: ' + skip);
      } else {
        finished = true;
      }
    }
  } catch (err) {
    console.log(err);
  }


}

async function process_albums() {
  let sql =
    `select c.row_id,
            c.catalogue_id                                                                  as album_id,
            c.catalogue_name                                                                as album_name,
            c.catalogue_cname                                                               as album_cname,
            concat('https://image.kuke.com/images/audio/cata200/', left(c.catalogue_id,1),'/', c.catalogue_id,
                   '.jpg')                                                                  as album_cover,
            concat('https://kml.kuke.com/catalogue/', c.catalogue_id)                       as album_url,
            l.display_name                                                                  as label_name,
            cc.cata_category_desc                                                           as category_name,
            group_concat(DISTINCT p.full_name ORDER BY p.full_name DESC SEPARATOR ', ')     as artist_name,
            group_concat(DISTINCT p.full_cname ORDER BY p.full_cname DESC SEPARATOR ', ')   as artist_cname,
            group_concat(DISTINCT p2.full_name ORDER BY p2.full_name DESC SEPARATOR ', ')   as composer_name,
            group_concat(DISTINCT p2.full_cname ORDER BY p2.full_cname DESC SEPARATOR ', ') as composer_cname
     from catalogue as c
              left join catlabel as l on c.catlabel_id = l.catlabel_id
              left join cata_category as cc on c.cata_category_id = cc.cata_category_id
              left join rel_artist_catalogue rac on c.catalogue_id = rac.catalogue_id
              left join person p on rac.person_id = p.person_id
              left join rel_composer_catalogue rcc on c.catalogue_id = rcc.catalogue_id
              left join person p2 on rcc.person_id = p2.person_id
     where c.showable = 1
     group by c.row_id limit ?,?`;

  await index_documents(sql, 0, 100, '/albums/documents');
}

async function main() {

  // albums
  await process_albums();

  await connPool.end();
}

main();


