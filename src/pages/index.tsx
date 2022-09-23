import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [results, setResults] = useState<Post[]>(postsPagination.results.map(result => (
    {
      ...result,
      first_publication_date: format(
        new Date(result.first_publication_date),
        "dd MMM' 'yyyy",
        {
          locale: ptBR,
        }
      )
    }
  )));

  function handleMorePosts() {

    fetch(`${nextPage}`)
      .then(response => response.json())
      .then(data => {
        setNextPage(data.next_page);

        setResults([...results, ...data.results]);
      })

  }

  return(
    <main className={styles.contentContainer}>
      { results.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`} >
          <section className={styles.post}>
            <h1>{post.data.title}</h1>
            <h5>{post.data.subtitle}</h5>

            <div>
              <FiCalendar className={styles.fi}/>
              <span>
                {post.first_publication_date}
              </span>

              <FiUser className={styles.fi}/>
              <span>{post.data.author}</span>
            </div>
          </section>
        </Link>
      ))}

      {nextPage !== null &&
        <button
          onClick={handleMorePosts}
        >
          Carregar mais posts
        </button>
      }

    </main>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 4
  });

  return {
    props: {
      postsPagination: postsResponse
    }
  }
};
