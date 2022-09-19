import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return(
    <>
      <main className={styles.contentContainer}>
        <section className={styles.post}>
          <h1>Como utilizar Hooks</h1>
          <h5>Pensando em sincronização em vez de ciclos de vida.</h5>

          <div>
            <FiCalendar className={styles.fi}/>
            <span>15 Mar 2021</span>
            
            <FiUser className={styles.fi}/>
            <span>Joseph Oliveira</span>
          </div>
        </section>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
