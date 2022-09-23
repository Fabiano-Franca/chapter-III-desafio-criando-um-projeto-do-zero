import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useState } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const route = useRouter();
  const [readTime, setReadTime] = useState(
    post.data.content.reduce((prevVal, elem) => {
        const total = RichText.asText(elem.body).split('');

        const min = Math.ceil(total.length / 200);
        return prevVal + min;
    }, 0)
  );

  if(route.isFallback)
    return <p>Carregando...</p>

  return(
    <>
      <img className={styles.banner} src={post.data.banner.url} alt="logo"/>
      <article className={styles.contentContainer}>
        <h1>{post.data.title}</h1>

        <address>
          <FiCalendar className={styles.fi}/>
          <time>{post.first_publication_date}</time>

          <FiUser className={styles.fi}/>
          <span>{post.data.author}</span>

          <FiClock className={styles.fi}/>
          <time> {readTime} min </time>
        </address>

        {post.data.content.map(content => (
          <article key={content.heading}>
            <h2>{content.heading}</h2>
            {content.body.map(paragraph => (
              <p key={paragraph.text}>{paragraph.text}</p>
            ))}
          </article>
        ))}

      </article>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps = async ({params }) => {

  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(JSON.stringify(response, null, 2))

  const post = {
    first_publication_date: new Date(response.first_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    }
  };

  return {
    props: {
      post
    },
    revalidate: 60 * 30
  }
};
