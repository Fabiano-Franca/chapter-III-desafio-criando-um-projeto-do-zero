import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser } from "react-icons/fi";
import { useEffect, useState } from 'react';

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

  const [postFetch, setPostFetch] = useState<PostPagination>({} as PostPagination);

  function handleMorePosts(next_page: string) {
    fetch(`${next_page}`)
      .then(response => response.json())
      .then(data => setPostFetch(data))
  }

  console.log(postFetch)

  return(
    <>
      <main className={styles.contentContainer}>
        {!postFetch ?
          <>
            { postFetch.results.map(post => (
              <section key={post.uid} className={styles.post}>
                <h1>{post.data.title}</h1>
                <h5>{post.data.subtitle}</h5>

                <div>
                  <FiCalendar className={styles.fi}/>
                  <span>
                    {new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>

                  <FiUser className={styles.fi}/>
                  <span>{post.data.author}</span>
                </div>
              </section>
            ))}
            { postFetch.next_page &&
              <button
                onClick={() => handleMorePosts(postsPagination.next_page)}
              >
                Carregar mais posts
              </button>
            }
          </>
         :
          <>
            { postsPagination.results.map(post => (
                <section key={post.uid} className={styles.post}>
                  <h1>{post.data.title}</h1>
                  <h5>{post.data.subtitle}</h5>

                  <div>
                    <FiCalendar className={styles.fi}/>
                    <span>
                      {new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>

                    <FiUser className={styles.fi}/>
                    <span>{post.data.author}</span>
                  </div>
                </section>
            ))}
            { postsPagination.next_page &&
              <button
                onClick={() => handleMorePosts(postsPagination.next_page)}
              >
                Carregar mais posts
              </button>
            }
          </>
        }
      </main>
    </>
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
