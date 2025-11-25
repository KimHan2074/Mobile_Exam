import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import HelloWordScreen from "@/components/demobuoi1/HelloWorldScreen";
import HelloApp from "@/components/demobuoi1/HelloApp";
import SayHello from '@/components/demobuoi1/SayHello';
import PtBacNhat from '@/components/demobuoi1/PtBacNhat';
import ParentChild from '@/components/demobuoi2/ParentChild';
import { Link } from 'expo-router';
import Calculator from '@/components/btvnbuoi3/calculator';
import Calculator_BMI from '@/components/demobuoi5/Calculator_BMI';
import GridBoxes from '@/components/demobuoi7/GridBoxes';
import GridBoxes2 from '@/components/demobuoi7/GridBoxes2';
import Shop from '@/components/demobuoi7/Shop';
import Layout1 from '@/components/demobuoi7/Layout1';
import Layout2 from '@/components/demobuoi7/Layout2';
import ShopScreen from '@/components/demobuoi7/ShopScreen';
import ShopComponent from '@/components/demobuoi7/ShopComponent';
import ShopFlatList from '@/components/demobuoi7/ShopFlatList';
import QuanLySV from '@/components/demobuoi9/QuanLySV';
import DanhBa from '@/components/demobuoi10/DanhBa';
import SanPhamSQLite from '@/components/demobuoi11/SanPhamSQLite';
import AppNavigator from '@/components/demobuoi13/AppNavigator';
export default function HomeScreen() {
  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/partial-react-logo.png')}
    //       style={styles.reactLogo}
    //     />
    //   }>
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Welcome! Ngo Thi Kim Han</ThemedText>
    //     <HelloWave />
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
    //     <ThemedText>
    //       Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
    //       Press{' '}
    //       <ThemedText type="defaultSemiBold">
    //         {Platform.select({
    //           ios: 'cmd + d',
    //           android: 'cmd + m',
    //           web: 'F12',
    //         })}
    //       </ThemedText>{' '}
    //       to open developer tools.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <Link href="/modal">
    //       <Link.Trigger>
    //         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
    //       </Link.Trigger>
    //       <Link.Preview />
    //       <Link.Menu>
    //         <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
    //         <Link.MenuAction
    //           title="Share"
    //           icon="square.and.arrow.up"
    //           onPress={() => alert('Share pressed')}
    //         />
    //         <Link.Menu title="More" icon="ellipsis">
    //           <Link.MenuAction
    //             title="Delete"
    //             icon="trash"
    //             destructive
    //             onPress={() => alert('Delete pressed')}
    //           />
    //         </Link.Menu>
    //       </Link.Menu>
    //     </Link>

    //     <ThemedText>
    //       {`Tap the Explore tab to learn more about what's included in this starter app.`}
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
    //     <ThemedText>
    //       {`When you're ready, run `}
    //       <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
    //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
    //     </ThemedText>
    //   </ThemedView>
    // </ParallaxScrollView>
    // <HelloWordScreen />
    // <PtBacNhat/>
    // <Calculator_BMI/>
    // <GridBoxes/>
    // <GridBoxes2/>
    // <Shop/>
    // <ShopScreen/>
    // <ShopComponent/>
    // <ShopFlatList/>
    // <SanPhamSQLite/>
    <AppNavigator/>
    // <Layout1/>
    // <Layout2/>
    // <Calculator/>
    // <HelloApp />
    // <SayHello name='Kim Hân' age={21} />
    // <ParentChild/>
    // <QuanLySV/>
    // <DanhBa/>
  )
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
