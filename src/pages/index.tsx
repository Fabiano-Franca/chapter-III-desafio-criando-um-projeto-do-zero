import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";
import { RichText } from 'prismic-dom';

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

export default function Home({ postsPagination }: HomeProps) {

  console.log(JSON.stringify(postsPagination, null, 2))

  return(
    <>
      <main className={styles.contentContainer}>

        {/* {postsPagination.results.map(post => {
          <section key={post.uid} className={styles.post}>
            <h1>{post.data.title}</h1>
            <h5>{post.data.subtitle}</h5>

            <div>
              <FiCalendar className={styles.fi}/>
              <span>15 Mar 2021</span>

              <FiUser className={styles.fi}/>
              <span>{post.data.author}</span>
            </div>
          </section>
        })} */}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostPagination> = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts');

  //console.log(JSON.stringify(postsResponse, null, 2))

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.data.first_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  return {
    props: {
      posts
    }
  }
};
